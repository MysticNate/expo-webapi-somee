import React, { createContext, useState } from "react";

export const UserContext = createContext();

// default products
const defaultProducts = [
    {
        id: 1,
        name: "Laptop",
        price: 999.99,
        image: require("../assets/images/laptop.jpg"),
    },
    {
        id: 2,
        name: "iPhone",
        price: 699.99,
        image: require("../assets/images/iphone.jpg"),
    },
    {
        id: 3,
        name: "AirPods",
        price: 149.99,
        image: require("../assets/images/airpods.jpg"),
    },
];


export default function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [registeredUsers, setRegisteredUsers] = useState([
        {
            email: "admin@admin.com",
            password: "admin123",
            isAdmin: true,
        },
    ]);
    const [products, setProducts] = useState(defaultProducts);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                registeredUsers,
                setRegisteredUsers,
                products,
                setProducts,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
