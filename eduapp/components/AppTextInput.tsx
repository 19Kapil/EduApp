import React, { useState } from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import Spacing from "../constants/Spacing";

const AppTextInput: React.FC<TextInputProps> = ({ style, ...otherProps }) => {
  const [focused, setFocused] = useState<boolean>(false);

  const inputStyle = [
    {
      fontFamily: Font["poppins-regular"],
      fontSize: FontSize.small,
      padding: Spacing * 2,
      backgroundColor: Colors.lightPrimary,
      borderRadius: Spacing,
      marginVertical: Spacing,
    },
    focused && {
      borderWidth: 3,
      borderColor: Colors.primary,
      shadowOffset: { width: 4, height: Spacing },
      shadowColor: Colors.primary,
      shadowOpacity: 0.2,
      shadowRadius: Spacing,
    },
    style, // allowing external styles to override
  ];

  return (
    <TextInput
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholderTextColor={Colors.darkText}
      style={inputStyle}
      {...otherProps}
    />
  );
};

export default AppTextInput;
