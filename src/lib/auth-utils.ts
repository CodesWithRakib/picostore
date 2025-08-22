import bcrypt from 'bcryptjs';

/**
 * Hashes a password using bcryptjs with automatic salt generation
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 * @throws Error if hashing fails
 */
export async function saltAndHashPassword(password: string): Promise<string> {
  try {
    // Generate salt with 12 rounds (recommended default)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compares a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns Promise<boolean> - True if passwords match
 */
export async function comparePassword(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Password comparison failed:', error);
    return false;
  }
}