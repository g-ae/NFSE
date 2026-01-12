import {createContext, useState, useContext, useEffect} from "react"

// Context to manage bundles added to the cart across the application.
const BundleContext = createContext()

/**
 * Custom hook to access the BundleContext.
 * @returns {object} Bundle context value.
 */
export const useBundleContext = () => useContext(BundleContext)

/**
 * Provides the BundleContext to its children.
 * @param {object} children - React children components
 * @returns {JSX.Element} Bundle context provider component.
 */
export const BundleProvider = ({children}) => {
    const [incart, setIncart] = useState([])

    // Load cart from localStorage on mount.
    useEffect(() => {

        const storedBundles = localStorage.getItem("incart")

        if (storedBundles) setIncart(JSON.parse(storedBundles))
    }, [])

    // Save cart to localStorage on change.
    useEffect(() => {
        localStorage.setItem('incart', JSON.stringify(incart))
    }, [incart])

    // Function to add a bundle to the cart.
    const addToCart = (bundle) => {
        setIncart(prev => [...prev, bundle])
    }

    // Function to remove a bundle from the cart by its bundleId.
    const removeFromCart = (bundleId) => {
        setIncart(prev => prev.filter(bundle => bundle.bundleId !== bundleId))
    }
    
    // Function to check if a bundle is in the cart by its bundleId.
    const isReserved = (bundleId) => {
        return incart.some(bundle => bundle.bundleId === bundleId)
    }

    const value = {
        incart,
        addToCart,
        removeFromCart,
        isReserved
    }

    // Provide a component the BundleContext value.
    return <BundleContext.Provider value={value}>
        {children}
    </BundleContext.Provider>
}