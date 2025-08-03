import { supabase } from '../supabaseClient';

// Simple password hashing function (in production, use bcrypt)
const hashPassword = async (password) => {
  // Convert password to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

// Verify password by comparing hashes
const verifyPassword = async (password, hash) => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

export const authService = {
  // Register a new user
  async register(email, password) {
    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash the password
      const passwordHash = await hashPassword(password);

      // Insert new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email: email,
            password_hash: passwordHash,
            role: 'user',
            profile_data: {}
          }
        ])
        .select('id, email, role, created_at')
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        throw new Error('Failed to create user account');
      }

      return {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          created_at: newUser.created_at
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Login user
  async login(email, password) {
    try {
      // Find user by email
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('id, email, password_hash, role, is_active, profile_data')
        .eq('email', email)
        .single();

      if (fetchError || !user) {
        throw new Error('No account found with this email');
      }

      // Check if user is active
      if (!user.is_active) {
        throw new Error('Account is deactivated. Please contact support.');
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Incorrect password');
      }

      // Update last login time
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile_data: user.profile_data
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, role, created_at, last_login, profile_data')
        .eq('id', userId)
        .single();

      if (error || !user) {
        throw new Error('User not found');
      }

      return {
        success: true,
        user: user
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({ 
          profile_data: profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select('id, email, role, profile_data')
        .single();

      if (error) {
        throw new Error('Failed to update profile');
      }

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get current user to verify current password
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', userId)
        .single();

      if (fetchError || !user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Update password
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          password_hash: newPasswordHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw new Error('Failed to update password');
      }

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete user account
  async deleteAccount(userId, password) {
    try {
      // Get user to verify password
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', userId)
        .single();

      if (fetchError || !user) {
        throw new Error('User not found');
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Password is incorrect');
      }

      // Delete user
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (deleteError) {
        throw new Error('Failed to delete account');
      }

      return {
        success: true,
        message: 'Account deleted successfully'
      };
    } catch (error) {
      console.error('Delete account error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}; 