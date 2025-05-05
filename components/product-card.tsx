"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Smartphone } from "lucide-react"
import { formatPrice, truncateText } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  slug: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card
        className="overflow-hidden h-full flex flex-col transition-all hover:shadow-lg border-blue-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.slug}`} className="relative block">
          {product.category && <Badge className="absolute top-2 right-2 z-10 bg-blue-600">{product.category}</Badge>}
          {discount > 0 && <Badge className="absolute top-2 left-2 z-10 bg-green-600">-{discount}%</Badge>}
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg?height=300&width=300"}
              alt={product.title}
              fill
              className={`object-cover transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"}`}
            />
          </div>
        </Link>
        <CardContent className="flex-grow p-4">
          <div className="flex items-center mb-2">
            <div className="flex items-center text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 text-sm font-medium">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500 ml-2">(120+ reviews)</span>
          </div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="text-gray-600 text-sm line-clamp-2 mb-2">{truncateText(product.description, 80)}</p>
          <div className="flex items-center">
            <p className="font-bold text-lg text-blue-700">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="text-sm text-gray-500 line-through ml-2">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" className="border-blue-200 hover:border-blue-300" asChild>
              <Link href={`/products/${product.slug}`} title="Buy Now">
                <Smartphone className="h-4 w-4 text-purple-600" />
                <span className="sr-only">Buy Now</span>
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
