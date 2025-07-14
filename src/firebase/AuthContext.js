import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeRole = onSnapshot(userRef, (userSnap) => {
          if (userSnap.exists()) {
            setRole(userSnap.data().role);
          } else {
            setDoc(userRef, { email: firebaseUser.email, role: "membre" });
            setRole("membre");
          }
          setLoading(false);
        });
        return unsubscribeRole;
      } else {
        setRole(null);
        setLoading(false);
      }
    });
    return () => {
      unsubscribeAuth();
    };
  }, []);

  const logout = () => signOut(auth);

  const value = { user, role, loading, logout };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
} 