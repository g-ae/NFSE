import {createContext, useState, useContext, useEffect} from "react"

const BundleContext = createContext()

export const useBundleContext = () => useContext(BundleContext)

export const BundleProvider = ({children}) => {
    const [incart, setIncart] = useState([])

    useEffect(() => {
        const storedBundles = localStorage.getItem("incart")

        if (storedBundles) setIncart(JSON.parse(storedBundles))
    }, [])

    useEffect(() => {
        localStorage.setItem('incart', JSON.stringify(incart))
    }, [incart])

    const addToCart = (bundle) => {
        setIncart(prev => [...prev, bundle])
    }

    const removeFromCart = (bundleId) => {
        setIncart(prev => prev.filter(bundle => bundle.bundleId !== bundleId))
    }
    
    const isReserved = (bundleId) => {
        return incart.some(bundle => bundle.bundleId === bundleId)
    }

    const value = {
        incart,
        addToCart,
        removeFromCart,
        isReserved
    }

    return <BundleContext.Provider value={value}>
        {children}
    </BundleContext.Provider>
}