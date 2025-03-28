import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { addAuth } from "../Redux/Slices/AuthSlice";
import store from "../Redux/reduxStore";
import { professionalLogIn } from "../Redux/Slices/professionalRedux";

const auth = getAuth();

const ProfessionalSignUp = async (
  state,
  sendMessage,

  isUser
) => {
  await createUserWithEmailAndPassword(auth, state.email, state.password)
    .then((res) => {
      const user = res.user;
      try {
        updateProfile(user, {
          displayName: state.username,
        }).then(() => {
          setDoc(doc(db, "proLogin", `${user.uid}`), state)
            .then(() =>
              store.dispatch(
                addAuth.addState({
                  name: user.displayName,
                  id: user.uid,
                  Professional: true,
                })
              )
            )
            .then(async () => {
              const docRef = doc(db, "ProfessionalDB", `${user.uid}`);
              await setDoc(docRef, {
                name: state.username,
                email: state.email,
                number: state.number,
                shopName: "",
                shopAddress: "",
                shopOpen: "10:00AM",
                shopClose: "09:00PM",
              }).then(() => alert("Form Saved"));
            });
          if (isUser === true) {
            let messageText =
              "Registered Successfully But Logout From User to Access your account !!!";
            let varient = "warning";
            sendMessage(messageText, varient);
            return;
          }
          store.dispatch(professionalLogIn());
          let messageText = "Registered Successfully !!!";
          let varient = "success";
          sendMessage(messageText, varient);
        });
      } catch (error) {
        console.log(error);
      }
    })
    .catch((err) => {
      let messageText = err.message;
      let varient = "error";
      sendMessage(messageText, varient);
    });
};
const ProfessionalSignIn = async (state, sendMessage) => {
  await signInWithEmailAndPassword(auth, state.email, state.password)
    .then((data) => {
      const check = data.user;
      const { displayName, uid } = check;
      store.dispatch(
        addAuth.addState({
          name: displayName,
          id: uid,
          Professional: true,
        })
      );
      store.dispatch(professionalLogIn());
      let messageText = "Logged in Successfully !!!";
      let varient = "success";
      sendMessage(messageText, varient);
    })
    .catch((err) => {
      let messageText = err.message;
      let varient = "error";
      sendMessage(messageText, varient);
    });
};

export { ProfessionalSignUp, ProfessionalSignIn };
