import { createContext, useContext, useEffect, useState } from "react";
// firebase
import { auth, db } from "../config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const q = query(
                    collection(db, "Families"),
                    where("email", "==", firebaseUser.email)
                );
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                    setUserData(doc.data());
                });
            } else {
                setUserData(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserProvider = () => {
    const context = useContext(UserContext);

    if (context == undefined) {
        throw new Error("useUserProvider must be used within a UserProvider");
    }
    return context.userData
}
