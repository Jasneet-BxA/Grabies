// src/components/ExploreMoreFood.tsx
 
import { useNavigate } from "react-router-dom";
 
const categories = [
  { title: "Pizza", image: "https://img.icons8.com/color/96/pizza.png" },
  { title: "Burger", image: "https://img.icons8.com/color/96/hamburger.png" },
  { title: "Momos", image: "https://img.icons8.com/color/96/dumplings.png" },
  { title: "Dessert", image: "https://img.icons8.com/color/96/cupcake.png" },
  { title: "Drinks", image: "https://img.icons8.com/color/96/cocktail.png" },
  { title: "Pasta", image: "https://img.icons8.com/color/96/spaghetti.png" },
  { title: "Spring Roll", image: "https://img.icons8.com/color/96/wrap.png" },
  { title: "North Indian", image: "https://img.icons8.com/color/96/curry.png" },
  { title: "South Indian", image: "https://img.icons8.com/color/96/rice-bowl.png" },
  { title: "Noodles", image: "https://img.icons8.com/color/96/noodles.png" },
];
 
export default function ExploreMoreFood() {
  const navigate = useNavigate();
 
  return (
    <div className="w-full bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-orange-700 mb-8">
          Your Food Adventure Starts Here!
        </h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {categories.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition"
              onClick={() => navigate(`/products?category=${item.title.toLowerCase()}`)}
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
  );
}