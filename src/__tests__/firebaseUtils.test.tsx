import {
  fetchUserName,
  logInWithEmailAndPassword,
  logout,
  registerWithEmailAndPassword,
} from '@/firebase/utils';
import { waitFor } from '@testing-library/react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { Mock, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    getAuth: vi.fn(() => ({
      currentUser: { uid: 'user123' },
      signInWithEmailAndPassword: vi.fn(),
      createUserWithEmailAndPassword: vi.fn(),
      signOut: vi.fn(),
    })),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  };
});

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  const db = [
    {
      uid: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
    },
    {
      uid: 'user2',
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  ];

  return {
    ...actual,
    collection: vi.fn(() => db),
    addDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn(),
  };
});

describe('Firebase Auth and Firestore Functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should sign in with email and password', async () => {
    const mockAuthResponse = { user: { uid: 'user123' } };
    (signInWithEmailAndPassword as Mock).mockResolvedValue(mockAuthResponse);

    await logInWithEmailAndPassword('test@example.com', 'password123');

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    );
  });

  it('should register a user with email and password and add to Firestore', async () => {
    const mockAuthResponse = { user: { uid: 'user123' } };
    (createUserWithEmailAndPassword as Mock).mockResolvedValue(mockAuthResponse);

    await registerWithEmailAndPassword('Test User', 'test@example.com', 'password123');

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    );

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
        uid: 'user123',
        name: 'Test User',
        email: 'test@example.com',
      });
    });
  });

  it('should sign out the user', async () => {
    await logout();
    expect(signOut).toHaveBeenCalledWith(expect.anything());
  });

  it("should fetch and set the user's name from Firestore", async () => {
    (collection as Mock).mockReturnValue('mockCollectionRef');
    (where as Mock).mockReturnValue('mockWhereCondition');

    const mockUser = { uid: 'user123' };
    const mockSetName = vi.fn();

    const mockDocs = { docs: [{ data: () => ({ name: 'Test User' }) }], empty: false };
    (getDocs as Mock).mockResolvedValue(mockDocs);

    await fetchUserName(mockUser as User, mockSetName);

    expect(collection).toHaveBeenCalledWith(expect.anything(), 'users');
    expect(query).toHaveBeenCalledWith('mockCollectionRef', 'mockWhereCondition');
    expect(mockSetName).toHaveBeenCalledWith('Test User');
  });

  it('should not fetch user name if user is null or undefined', async () => {
    const mockSetName = vi.fn();

    await fetchUserName(null, mockSetName);

    expect(getDocs).not.toHaveBeenCalled();
    expect(mockSetName).not.toHaveBeenCalled();
  });

  it('should log and re-throw error if createUserWithEmailAndPassword fails', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const mockError = new Error('Failed to create user');
    (createUserWithEmailAndPassword as Mock).mockRejectedValue(mockError);

    await expect(
      registerWithEmailAndPassword('Test User', 'test@example.com', 'password123')
    ).rejects.toThrow('Failed to create user');

    expect(consoleSpy).toHaveBeenCalledWith(mockError);

    consoleSpy.mockRestore();
  });

  it('should throw a new "unknown error" if error is not an instance of Error', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const mockError = { code: 500 };
    (createUserWithEmailAndPassword as Mock).mockRejectedValue(mockError);

    await expect(
      registerWithEmailAndPassword('Test User', 'test@example.com', 'password123')
    ).rejects.toThrow('An unknown error occurred');

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should log and re-throw error if addDoc fails', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    const mockUser = { user: { uid: 'user123' } } as unknown as User;
    (createUserWithEmailAndPassword as Mock).mockResolvedValue(mockUser);

    const mockError = new Error('Failed to add user to Firestore');
    (addDoc as Mock).mockRejectedValue(mockError);

    await expect(
      registerWithEmailAndPassword('Test User', 'test@example.com', 'password123')
    ).rejects.toThrow('Failed to add user to Firestore');

    expect(consoleSpy).toHaveBeenCalledWith(mockError);

    consoleSpy.mockRestore();
  });
});
