import axios from "axios";
import React, { useEffect, useState } from "react";

function Book() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [, setError] = useState(null);
  const [counties, setCounties] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedSubcounty, setSelectedSubcounty] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [rawResponse, setRawResponse] = useState("");

  // Fetch Counties on Page Load
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/counties/")
      .then((res) => setCounties(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch Subcounties when County changes
  useEffect(() => {
    if (selectedCounty) {
      axios
        .get(
          `http://127.0.0.1:8000/api/counties/${selectedCounty}/subcounties/`,
        )
        .then((res) => {
          setSubcounties(res.data);
          setAreas([]);
          setSelectedSubcounty("");
          setSelectedArea("");
        })
        .catch((err) => console.error(err));
    } else {
      setSubcounties([]);
      setAreas([]);
    }
  }, [selectedCounty]);

  // Fetch Areas when Subcounty changes
  useEffect(() => {
    if (selectedSubcounty) {
      axios
        .get(
          `http://127.0.0.1:8000/api/subcounties/${selectedSubcounty}/areas/`,
        )
        .then((res) => {
          setAreas(res.data);
          setSelectedArea("");
        })
        .catch((err) => console.error(err));
    } else {
      setAreas([]);
    }
  }, [selectedSubcounty]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setLocation({ lat, lng });
          reversepoints(lat, lng);
        },
        (err) => setError(`error is: ${err.message}`),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      setError("geolocation is not supported in this location");
      alert("geolocation is not supported in this location");
    }
  };

  const reversepoints = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      if (data.address) {
        setAddress(formatAddress(data.address));
      }
    } catch (err) {
      setError("Could not retrieve address details");
    }
  };

  const formatAddress = (address) => {
    const parts = [];
    if (address.road) parts.push(address.road);
    if (address.house_number) parts.push(address.house_number);
    if (address.city || address.town || address.village)
      parts.push(address.city || address.town || address.village);
    if (address.country) parts.push(address.country);
    return parts.join(", ");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArea || !pickupDate || !location) {
      alert("Please select area, pickup date, and allow location");
      return;
    }

    const payload = {
      area_id: selectedArea,
      pickup_date: pickupDate,
      latitude: location.lat,
      longitude: location.lng,
      address: address,
      rawResponse: rawResponse, // Include raw response for debugging
    };

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/bookings/create/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            "Content-Type": "application/json",
          },
        },
      );
      alert("Booking created successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create booking");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 ">
      <div className="w-full max-w-4xl bg-white rounded-lg  shadow-lg overflow-hidden mt-14">
        <div className="md:flex">
          {/* Left side - Orange background */}
          <div className="bg-[#FFA500] text-white p-8 md:w-1/3">
            <h2 className="text-2xl font-bold mb-4">Welcome dear user</h2>
            <p className="mb-6">
              Book a collection and get to experience a smooth ride cleaning
              your environment
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-white mr-2">✓</div>
                <p>Easy booking process</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-white mr-2">✓</div>
                <p>Reliable service</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-white mr-2">✓</div>
                <p>Environmentally friendly</p>
              </div>
            </div>
          </div>

          {/* Right side - White background with form */}
          <div className="p-8 md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* County Dropdown */}
              <div>
                <label
                  htmlFor="county"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  County
                </label>
                <select
                  id="county"
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select County</option>
                  {counties.map((county) => (
                    <option key={county.id} value={county.id}>
                      {county.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcounty Dropdown */}
              <div>
                <label
                  htmlFor="subcounty"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subcounty
                </label>
                <select
                  id="subcounty"
                  value={selectedSubcounty}
                  onChange={(e) => setSelectedSubcounty(e.target.value)}
                  disabled={!selectedCounty}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  <option value="">Select Subcounty</option>
                  {subcounties.map((subcounty) => (
                    <option key={subcounty.id} value={subcounty.id}>
                      {subcounty.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area Dropdown */}
              <div>
                <label
                  htmlFor="area"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Area
                </label>
                <select
                  id="area"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  disabled={!selectedSubcounty}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  <option value="">Select Area</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup Date */}
              <div>
                <label
                  htmlFor="pickupDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Pickup Date
                </label>
                <input
                  type="date"
                  id="pickupDate"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Location Section */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={getUserLocation}
                  className="w-full bg-[#FFA500] text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Get My Location
                </button>

                {location && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      Latitude: {location.lat}, Longitude: {location.lng}
                    </p>
                    {address && (
                      <p className="text-sm text-gray-700 mt-1">
                        Address: {address}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {/* Textarea for Raw API Response */}
              <div>
                <label
                  htmlFor="rawResponse"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional location info
                </label>
                <textarea
                  id="rawResponse"
                  value={rawResponse}
                  onChange={(e) => setRawResponse(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="additional response will appear here"
                />
              </div>
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#FFA500] text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Submit Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Book;

