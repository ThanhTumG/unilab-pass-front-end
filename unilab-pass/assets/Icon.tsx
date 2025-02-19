import { Icon } from "react-native-paper";

// Types
type IconsType = {
  [key: string]: (props: any) => JSX.Element;
};

// Colors
const primaryColor = "#1B61B5";
const greyColor = "#6C6C6C";

// Icon
const icons: IconsType = {
  HomeScreen: (props) => (
    <Icon
      source="home-variant-outline"
      size={28}
      color={greyColor}
      {...props}
    />
  ),
  AccessManagementScreen: (props) => (
    <Icon source="history" size={30} color={greyColor} {...props} />
  ),
  RecordActivityScreen: (props) => (
    <Icon source="qrcode-scan" size={30} color={greyColor} {...props} />
  ),
  AccountManagementScreen: (props) => (
    <Icon
      source="account-multiple-outline"
      size={30}
      color={greyColor}
      {...props}
    />
  ),
  ProfileScreen: (props: any) => (
    <Icon
      source="account-circle-outline"
      size={30}
      color={greyColor}
      {...props}
    />
  ),
};

export default icons;
