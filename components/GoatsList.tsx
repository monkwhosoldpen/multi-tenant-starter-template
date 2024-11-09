import useTenant from "@/lib/usetenant";
import { useState, useEffect } from "react";

// GoatsList Component using the Tenant Context
const GoatsList: React.FC = () => {
  const [goats, setGoats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { tenantSupabase } = useTenant();  // Get the tenant client from context

  useEffect(() => {
    if (tenantSupabase) {
      fetchGoats();
    }
  }, [tenantSupabase]);

  const fetchGoats = async () => {
    setLoading(true);

    const { data, error } = await tenantSupabase.from("goats").select("*");

    if (error) {
      console.error("Error fetching goats:", error);
      setGoats([]);
    } else {
      const typedGoats = data.map((item: any) => ({
        id: item.id,
        image_url: item.image_url,
        username: item.username,
        fullname: item.fullname,
        description: item.description,
        profileimage: item.profileimage,
      }));
      setGoats(typedGoats);
    }

    setLoading(false);
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
      {loading ? (
        <div>Loading...</div>
      ) : (
        goats.map((goat) => (
          <div
            key={`${goat.id}-${goat.username}`}
            className="flex flex-col items-center border border-gray-600 rounded p-2 transition-transform transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
            onClick={() => console.log(goat.username)}
          >
            <img
              src={goat.profileimage || "https://via.placeholder.com/100"}
              alt={goat.username}
              className="rounded-full w-12 h-12 object-cover mb-1"
            />
            <span className="font-medium text-xs w-full text-center truncate">
              {goat.fullname}
            </span>
            <span className="text-xs w-full text-center truncate">
              {goat.description || "NA"}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default GoatsList;
