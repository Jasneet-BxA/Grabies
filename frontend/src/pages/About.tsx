import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <div className="w-full">
      <div className="relative h-[300px] w-full">
        <img
          src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=900&q=80"
          alt="Banner"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold tracking-wide">
            ABOUT US
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div data-aos="fade-right">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80"
            alt="Cooking"
            className="rounded-lg shadow-lg object-cover w-full"
          />
        </div>

        <div data-aos="fade-left">
          <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-4">
            We Are Specialized In <br /> Spicy Modern Fusion Food
          </h2>

          <p className="text-orange-600 font-semibold mb-2 tracking-wide">
            WELCOME TO GRABIES
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            We’re passionate about delivering vibrant, flavorful meals crafted
            by top chefs. Whether it's Indian, Italian, or Asian cuisine —
            you’ll find something to love. Our fusion blends tradition and
            modern taste, all delivered fresh to your door.
          </p>

          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Handpicked restaurants & curated menus</li>
            <li>Real-time delivery tracking</li>
            <li>Innovative culinary fusions</li>
            <li>Unmatched speed & service</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div data-aos="fade-right">
          <h2 className="text-3xl font-bold text-orange-700 mb-4">
            OUR MISSION
          </h2>
          <p className="text-gray-700 leading-relaxed">
            At Grabies, our mission is to revolutionize the way people enjoy
            food by making top-quality meals accessible to everyone. We believe
            in celebrating culinary diversity, supporting local kitchens, and
            delivering joy — one meal at a time.
            <br />
            <br />
            Our goal is to inspire a new generation of food lovers who
            appreciate quality, convenience, and creativity in every bite.
          </p>
        </div>

        <div data-aos="fade-left">
          <img
            src="https://images.unsplash.com/photo-1617010644337-b22e658053b7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Our Mission"
            className="rounded-lg shadow-lg object-cover w-full"
          />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div data-aos="fade-right">
          <img
            src="https://plus.unsplash.com/premium_photo-1731890642701-018c4b410da2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Fast Delivery"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>

        <div data-aos="fade-left">
          <h2 className="text-3xl font-bold text-orange-700 mb-4 leading-snug">
            We Provide <br /> Fast Delivery
          </h2>

          <p className="text-orange-600 font-semibold mb-3 tracking-wide">
            FRESH. FAST. RIGHT TO YOUR DOOR.
          </p>

          <p className="text-gray-700 leading-relaxed mb-5">
            At Grabies, speed is our specialty. Our optimized logistics system
            ensures that your meal gets from our kitchen to your doorstep in
            record time. Whether you're in a rush or just hungry, we've got your
            back.
          </p>

          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Average delivery time: under 30 minutes</li>
            <li>Live GPS order tracking</li>
            <li>Priority delivery during peak hours</li>
            <li>Highly-rated delivery partners</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
