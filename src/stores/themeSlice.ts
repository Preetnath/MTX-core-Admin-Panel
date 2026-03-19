import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import TinkerSideMenu from "@/themes/Tinker/SideMenu";

export const themes = [
  {
    name: "tinker",
    layout: "side-menu",
    component: TinkerSideMenu,
  },
] as const;

export type Themes = (typeof themes)[number];

interface ThemeState {
  value: {
    name: Themes["name"];
    layout: Themes["layout"];
  };
}

export const getTheme = (search?: {
  name: Themes["name"];
  layout: Themes["layout"];
}) => {
  const searchValues =
    search === undefined
      ? {
        name: localStorage.getItem("theme"),
        layout: localStorage.getItem("layout"),
      }
      : search;
  return themes.filter((item, key) => {
    return (
      item.name === searchValues.name && item.layout === searchValues.layout
    );
  })[0];
};

const initialState: ThemeState = {
  value: {
    name: "tinker",
    layout: "side-menu",
  },
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Themes["name"]>) => {
      state.value = {
        name: action.payload,
        layout: state.value.layout,
      };

      localStorage.setItem("theme", action.payload);
    },
    setLayout: (state, action: PayloadAction<Themes["layout"]>) => {
      state.value = {
        name: state.value.name,
        layout: action.payload,
      };

      localStorage.setItem("layout", action.payload);
    },
  },
});

export const { setTheme, setLayout } = themeSlice.actions;

export const selectTheme = (state: RootState) => {
  if (localStorage.getItem("theme") === null) {
    localStorage.setItem("theme", "tinker");
  }

  if (localStorage.getItem("layout") === null) {
    localStorage.setItem("layout", "side-menu");
  }

  return state.theme.value;
};

export default themeSlice.reducer;
