import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import store from "../Redux/reduxStore";
import { addAuth } from "../Redux/Slices/AuthSlice";
import { userLogIn } from "../Redux/Slices/UserRedux";

const UserSignUp = async (
  signUser,
  sendMessage,

  navigate,
  isPro
) => {
  // console.log("before fucntion:", signUser);

  const auth = getAuth();
  await createUserWithEmailAndPassword(auth, signUser.email, signUser.password)
    .then((res) => {
      const user = res.user;
      try {
        updateProfile(user, {
          displayName: signUser.username,
        }).then(() => {
          setDoc(doc(db, "userLogin", `${user.uid}`), signUser)
            .then(() =>
              store.dispatch(
                addAuth.addState({
                  name: user.displayName,
                  id: user.uid,
                  user: true,
                })
              )
            )
            .then(async () => {
              const docRef = doc(db, "UserDB", `${user.uid}`);
              await setDoc(docRef, {
                name: signUser.username,
                email: signUser.email,
                number: signUser.number,
                password: signUser.password,
              }).then(() => {
                if (isPro === true) {
                  let varient = "success";
                  let messageText =
                    "Registered But Logout from Professional to access Account !!!";
                  sendMessage(varient, messageText);
                  setTimeout(() => {
                    navigate("/login");
                  }, 1200);
                  return;
                }
                store.dispatch(userLogIn());
                let varient = "success";
                let messageText = "Register Successfully !!!";
                sendMessage(varient, messageText);
                setTimeout(() => {
                  navigate("/login");
                }, 1200);
              });
            });
        });
      } catch (error) {
        let varient = "warning";
        let messageText = error;
        sendMessage(varient, messageText);
      }
    })
    .catch((err) => {
      let varient = "error";
      let messageText = err.message;
      sendMessage(varient, messageText);
    });
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
