import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import { api } from "../../lib/axios";
import { DeleteButton } from "../../components/deleteButton";
import { LandPlot, LogOut, Plane, Plus } from "lucide-react";

interface User {
  name: string;
  email: string;
  trips: Trip[];
}

interface Trip {
  id: string;
  destination: string;
}

export function Sidebar() {
  const [user, setUser] = useState<User>({ name: "", email: "", trips: [] });
  const [showTrips, setShowTrips] = useState(false);
  const token = localStorage.getItem("TOKEN_KEY");

  const deleteTrip = (tripId: string) => {
    console.log(tripId);
    api
      .delete(`/trips/${tripId}/remove`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setUser((prevState) => ({
          ...prevState,
          trips: prevState.trips.filter((trip) => trip.id !== tripId),
        }));
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("TOKEN_KEY");
    //redirect nao funciona
    redirect("/");
  };
  const handleChangeTrip = (tripId: string) => {
    console.log(tripId);
    window.location.href = `/trips/${tripId}`;
  };

  const changeShowTrips = () => {
    setShowTrips(!showTrips);
  };

  useEffect(() => {
    api
      .get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUser(response.data.user));
  }, [token]);
  return (
    <aside className="z-40 w-1/6 h-screen overflow-y-auto  bg-zinc-800">
      <div className="h-full px-12 py-8 overflow-y-auto  bg-zinc-800">
        <a href="/" className="flex items-center ps-2.5 mb-5">
          <img src="/logo.svg" alt="plann.er" className="h-6  sm:h-8" />
        </a>
        <div className="w-full h-px mb-5 bg-white"></div>
        <ul className="space-y-3 font-medium">
          <li>
            <button className="bg-lime-300 text-lime-950 rounded-lg px-5 py-2 w-full font-medium flex items-center gap-2 hover:bg-lime-400">
              <Plus className="size-5" />
              Nova viagem
            </button>
          </li>
          <li>
            <a
              onClick={changeShowTrips}
              className="flex items-center cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <Plane className="size-5" />
              <span className="flex-1 ms-3 whitespace-nowrap">
                Minhas viagens
              </span>
            </a>
          </li>
          {showTrips && (
            <li>
              {user.trips.length > 0 ? (
                user.trips.map((trip) => (
                  <li key={trip.id}>
                    <div className="flex items-center justify-between rounded-lg text-white p-2 hover:bg-zinc-700">
                      <a
                        onClick={() => handleChangeTrip(trip.id)}
                        className="flex items-center p-2 cursor-pointer "
                      >
                        <LandPlot className="size-5" />
                        <span className="ms-3">{trip.destination}</span>
                      </a>
                      <DeleteButton onClick={() => deleteTrip(trip.id)} />
                    </div>
                  </li>
                ))
              ) : (
                <li>
                  <span className="text-gray-500">
                    Nenhuma viagem cadastrada.
                  </span>
                </li>
              )}
            </li>
          )}
          <div className="w-full h-px my-5 bg-white"></div>
          <li>
            <a
              onClick={handleLogout}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <LogOut className="size-5" />

              <span className="ms-3">Sair</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
