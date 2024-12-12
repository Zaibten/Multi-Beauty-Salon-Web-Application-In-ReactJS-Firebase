import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./components/Home/Home";
import Loginpage from "./components/Loginpage/Loginpage";
import ShopDetail from "./components/Pages/ShopDetail";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BookShop from "./components/Pages/BookShop";
import User from "./components/Pages/User";
import Help from "./components/Pages/Help";
import BarberRegister from "./components/Pages/BarberRegister";
import Schedule from "./components/Pages/Schedule";
import SearchShop from "./components/Search/SearchShop";
import DashBoard from "./components/admin/DashBoard";
import ProfessionalProfile from "./components/admin/nestedRoutes/Profile";
import Profile from "./components/Pages/Profile";
import AddShopDetails from "./components/admin/nestedRoutes/AddShopDetails";
import ProfessionalSchedule from "./components/admin/nestedRoutes/ProfessionalSchedule";
import { useSelector } from "react-redux";

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false); //user Route
  // const [isProfessional, setProfessional] = useState(false); //Professional Route
  const isPro = useSelector((state) => state.isPro.isProfessional);
  const isUser = useSelector((state) => state.isUser.isUser);
  // console.log("Professional:", isPro, "User: ", isUser);
  //user Private Route
  function PrivateRoute({ children }) {
    if (!isUser) {
      // return <Navigate to="/login" />;
    } else {
      return children;
    }
  }

  //Professional Private Route
  function ProfessionalRoute({ children }) {
    if (!isPro) {
      return <Navigate to="/" />;
    } else {
      return children;
    }
  }

  return (
    <>
      <Header isUser={isUser} isPro={isPro} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/shop/:id" element={<ShopDetail />} />
        <Route path="/shop/:parent/:id/booking" element={<BookShop />} />

        <Route
          path="/user"
          element={
            <PrivateRoute isUser={isUser}>
              <User />
            </PrivateRoute>
          }
        />
        <Route path="/professional-register" element={<BarberRegister />} />
        <Route path="/help" element={<Help />} />
        <Route path="/Login" element={<Loginpage />} />
        <Route path="/search" element={<SearchShop />} />
        <Route path="/schedule" element={<Schedule />} />

        {/* Professional Route */}

        <Route
          path="/dashboard"
          element={
            <ProfessionalRoute isPro={isPro}>
              <DashBoard />
            </ProfessionalRoute>
          }
        >
          <Route index element={<ProfessionalProfile />} />
          <Route path="add-services" element={<AddShopDetails />} />
          <Route
            path="schedules-professional"
            element={<ProfessionalSchedule />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
