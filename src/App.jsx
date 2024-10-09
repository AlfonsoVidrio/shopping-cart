import { useState, useEffect } from "react"
import { db } from "./data/db.js"
import { Header } from "./components/Header.jsx"
import { Guitar } from "./components/Guitar.jsx"
import { Footer } from "./components/Footer.jsx"

function App() {
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
  },[cart])

  const addToCart = (item) => {
    const itemExists = cart.findIndex(guitar => guitar.id === item.id)
    // Si el item ya existe en el carrito, incrementar la cantidad
    if (itemExists >= 0) {
      const updatedCart = [...cart]
      if(item.quantity < MAX_ITEMS) updatedCart[itemExists].quantity++
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
      if ( item.id === id && item.quantity > MIN_ITEMS){
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

  return (
    <>
      <Header 
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) =>
            <Guitar
              key={guitar.id}
              guitar={guitar}
              setCart={setCart}
              addToCart={addToCart}
            />)}
        </div>

      </main>
      <Footer />
    </>
  )
}

export default App
