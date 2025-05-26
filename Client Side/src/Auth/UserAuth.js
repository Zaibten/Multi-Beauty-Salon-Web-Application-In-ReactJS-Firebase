import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc,collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import store from "../Redux/reduxStore";
import { addAuth } from "../Redux/Slices/AuthSlice";
import { userLogIn } from "../Redux/Slices/UserRedux";

const UserSignUp = async (signUser, sendMessage, navigate, isPro) => {
  const { username, email, number, password } = signUser;

  try {
    // 1. Check if email, username, or number already exists
    const usersRef = collection(db, "UserDB");
    const q = query(
      usersRef,
      where("email", "==", email)
    );
    const emailSnapshot = await getDocs(q);

    const usernameSnapshot = await getDocs(
      query(usersRef, where("name", "==", username))
    );

    const numberSnapshot = await getDocs(
      query(usersRef, where("number", "==", number))
    );

    if (!emailSnapshot.empty) {
      sendMessage("error", "Email already in use.");
      return;
    }

    if (!usernameSnapshot.empty) {
      sendMessage("error", "Username already in use.");
      return;
    }

    if (!numberSnapshot.empty) {
      sendMessage("error", "Phone number already in use.");
      return;
    }

    // 2. Proceed with Firebase Auth account creation
    const auth = getAuth();
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await updateProfile(user, {
      displayName: username,
    });

    await setDoc(doc(db, "userLogin", user.uid), signUser);

    store.dispatch(
      addAuth.addState({
        name: user.displayName,
        id: user.uid,
        user: true,
      })
    );

    await setDoc(doc(db, "UserDB", user.uid), {
      name: username,
      email: email,
      number: number,
      password: password,
    });

    if (isPro === true) {
      sendMessage("success", "Registered but logout from Professional to access Account!");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }

    store.dispatch(userLogIn());
    sendMessage("success", "Registered Successfully!");
    setTimeout(() => navigate("/login"), 1200);

  } catch (error) {
    sendMessage("error", error.message);
  }
};

const UserSignIn = async (user, sendMessage, navigate) => {
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, user.email, user.password)
    .then((data) => {
      const check = data.user;
      const { displayName, uid } = check;

      // Save user state to Redux
      store.dispatch(
        addAuth.addState({
          name: displayName,
          id: uid,
          user: true,
        })
      );

      // Save user state to localStorage for persistence
      localStorage.setItem(
        "authState",
        JSON.stringify({ name: displayName, id: uid, user: true })
      );

      // Dispatch login action
      store.dispatch(userLogIn());

      // Show success message
      let varient = "success";
      let messageText = "User Login Success !!!";
      sendMessage(varient, messageText);

      setTimeout(() => {
        navigate("/"); // Navigate to the home page
        setTimeout(() => {
          window.location.reload(); // Reload the page after navigation
        }, 100); // Add a small delay to ensure navigation occurs first
      }, 1200);
    })
    .catch((err) => {
      let varient = "error";
      let messageText = err.message;
      sendMessage(varient, messageText);
    });
};


export { UserSignUp, UserSignIn };
