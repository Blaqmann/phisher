// src/services/api.js
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';
const auth = getAuth();

// Signup function
export const signup = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await sendEmailVerification(user);
        await setDoc(doc(db, "users", user.uid), {
            name,
            email,
            role: 0 // Default role is 0 for regular users
        });
        toast.success('Signup successful, please verify your email.');
        return user;
    } catch (error) {
        const errorMessage = getFirebaseErrorMessage(error.code);
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
};

// Login function
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            toast.error('Please verify your email before logging in.');
            await signOut(auth);
            throw new Error('Email not verified');
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (!userData || typeof userData.role === 'undefined') {
            throw new Error('User role not found in database');
        }

        toast.success('Login successful.');
        return { ...user, role: userData.role };
    } catch (error) {
        const errorMessage = getFirebaseErrorMessage(error.code);
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
};

// Logout function
export const logout = async () => {
    try {
        await signOut(auth);
        toast.success('Logout successful.');
    } catch (error) {
        toast.error(error.message);
        throw error;
    }
};

// Check if the user is authenticated
export const isAuthenticated = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(!!user);
        }, reject);
    });
};
