declare module 'vtex.product-context/useProduct' {
  interface Product {
    linkText: string
    releaseDate: string
  }

  interface ProductContext {
    product: Product
  }

  export default function useProduct(): ProductContext
}