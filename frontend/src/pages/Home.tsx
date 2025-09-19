import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const slides = [
  {
    image:
      "https://plus.unsplash.com/premium_photo-1695758787675-d67242b3529f?q=80&w=721&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Delicious Burgers",
    subtitle: "Get the juiciest deals on all burgers",
  },
  {
    image:
      "https://images.unsplash.com/photo-1703073186159-ae38e1c42dee?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Pizza Mania",
    subtitle: "Cheesy, crusty, and loaded with toppings",
  },
  {
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Momo Melody",
    subtitle: "Spicy flavors delivered to your door",
  },
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()

  const delay = 4000 // 4 seconds

  useEffect(() => {
    resetTimeout()
    timeoutRef.current = setTimeout(
      () => setCurrent((prevIndex) => (prevIndex + 1) % slides.length),
      delay
    )
    return () => resetTimeout()
  }, [current])

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  return (
    <div className="w-full">
      {/* ✅ Carousel */}
      <div className="relative w-full overflow-hidden h-[400px] md:h-[500px]">
        <div
          className="whitespace-nowrap transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="inline-block w-full h-[400px] md:h-[500px] relative"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover brightness-75"
              />
              <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-20 text-white z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl drop-shadow">{slide.subtitle}</p>
                <button className="mt-6 px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full ${
                current === index ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ✅ Full-width About Us Section */}
      <div className="w-full bg-orange-50 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-4 py-10">
          {/* Left: Image */}
          <div className="w-full md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=900&q=80"
              alt="About Grabies"
              className="w-full h-full rounded-lg shadow-md object-cover"
            />
          </div>

          {/* Right: Text & Button */}
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-bold text-orange-700 mb-4">
              About Grabies
            </h2>
            <p className="text-gray-700 mb-6 max-w-xl">
              Grabies simplifies your life by bringing diverse cuisines from your favorite local restaurants directly to your doorstep. From the aromatic spices of a Hyderabadi biryani to the comforting warmth of a hot pizza and the sweet allure of decadent desserts, our platform connects you with a vast array of culinary delights. We ensure a seamless ordering experience, allowing you to browse menus, place orders, and track your delivery from a wide selection of options—all with speed and efficiency, making mealtime an effortless pleasure. 
            </p>
            <Button
              onClick={() => navigate("/about")}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Know More
            </Button>
          </div>
        </div>
      </div>
      {/* ✅ Explore More Food Section */}
<div className="w-full bg-white py-12">
  <div className="max-w-6xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-center text-orange-700 mb-8">
      Explore More Food
    </h2>
    <div className="flex overflow-x-auto gap-6 scrollbar-hide justify-center">
      {[
        { title: "Pizza", image: "https://img.icons8.com/color/96/pizza.png" },
        { title: "Burgers", image: "https://img.icons8.com/color/96/hamburger.png" },
        { title: "Momos", image: "https://img.icons8.com/color/96/dumplings.png" },
        { title: "Desserts", image: "https://img.icons8.com/color/96/cupcake.png" },
        { title: "Biryani", image: "https://img.icons8.com/color/96/rice-bowl.png" },
        { title: "Fries", image: "https://img.icons8.com/color/96/fries.png" },
        { title: "Noodles", image: "https://img.icons8.com/color/96/noodles.png" },
      ].map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
          onClick={() => console.log(`Clicked: ${item.title}`)} // or navigate(`/menu?category=${item.title.toLowerCase()}`)
        >
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center shadow-md">
            <img
              src={item.image}
              alt={item.title}
              className="w-12 h-12 object-contain"
            />
          </div>
          <p className="mt-2 text-sm font-medium text-gray-700">{item.title}</p>
        </div>
      ))}
    </div>
  </div>
</div>

    </div>
  )
}
