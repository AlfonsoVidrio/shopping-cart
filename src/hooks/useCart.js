import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db.js"

export const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }


    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MIN_ITEMS = 1
    const MAX_ITEMS = 10

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = (item) => {
        const itemExists = cart.findIndex(guitar => guitar.id === item.id)
        // Si el item ya existe en el carrito, incrementar la cantidad
        if (itemExists >= 0) {
            const updatedCart = [...cart]
            if (item.quantity < MAX_ITEMS) updatedCart[itemExists].quantity++
            setCart(updatedCart)
        }
        // Si el item no existe en el carrito, agregarlo con cantidad 1
        else {
            item.quantity = 1
            setCart([...cart, item])
        }
    }

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    const decreaseQuantity = (id) => {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    const increaseQuantity = (id) => {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    const clearCart = () => {
        setCart([])
    }

        // State Derivado
    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

    return {
        data,
        cart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        setCart,
        addToCart,
        isEmpty,
        cartTotal
    }
}
