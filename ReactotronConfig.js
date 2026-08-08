import Reactotron from "reactotron-react-native";
import { NativeModules } from "react-native";

const scriptHostname =
  NativeModules?.SourceCode?.scriptURL?.split("://")[1]?.split(":")[0] || "localhost";

if (__DEV__) {
  Reactotron.configure({
    name: "Reserva Driver",
    host: "localhost",
  })
    .useReactNative({
      networking: {
        ignoreUrls: /symbolicate/,
      },
      errors: { veto: () => false },
      overlay: false,
    })
    .connect();

  Reactotron.clear();
}

export default Reactotron;