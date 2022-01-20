import { retrieveData } from "./uiBuilders";
export { colorTheme as runColorTheme } from "./colorTheme";

const { closePlugin, notify } = figma;

export async function runRetrieveData() {
  interface UserData {
    name: string;
    city: string;
    country: string;
    avatar: string;
  }

  try {
    // this should retrieve data. be sure to visit url first
    const { data } = await retrieveData<UserData[]>(
      "https://cors-anywhere.herokuapp.com/https://jsonkeeper.com/b/RWNQ"
    );
    console.log("DATA!", data);
    console.log("FIRST AVATAR!", data[0].country);
    // this should fail
    await retrieveData<UserData[]>("https://cheese.meatballs");
    closePlugin();
  } catch (error: any) {
    notify(error.message, { error: true });
    closePlugin();
  }
}
