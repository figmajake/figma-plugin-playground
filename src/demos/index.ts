import { execBrowserFunction, fetchJSON, fillWithImageUrl } from "./helpers";
export { animation as runAnimation } from "./animation";
export { colorTheme as runColorTheme } from "./colorTheme";

const { closePlugin, currentPage, notify } = figma;

export async function runExecBrowserFunction() {
  const valueFromBrowser = await execBrowserFunction<number>(
    () =>
      new Promise((resolve) => {
        // We are now in the web browser and not the figma context!
        const el = document.createElement("h1");
        el.innerText = "Hello World";
        setTimeout(() => {
          resolve(document.documentElement.outerHTML);
        }, 1000);
      })
  );
  console.log(valueFromBrowser);
  closePlugin();
}

export async function runFetchJSON() {
  interface UserData {
    name: string;
    city: string;
    country: string;
    avatar: string;
  }

  try {
    // this should retrieve data. be sure to visit url first
    const data = await fetchJSON<any[]>("https://records.jake.fun/data.json");
    console.log(data);
    // const data = await fetchJSON<UserData[]>(
    //   "https://cors-anywhere.herokuapp.com/https://jsonkeeper.com/b/RWNQ"
    // );
    // console.log("DATA!", data);
    // console.log("FIRST AVATAR!", data[0].avatar);
    // this should fail
    // await fetchJSON<UserData[]>("https://cheese.meatballs");
    closePlugin();
  } catch (error: any) {
    notify(error.message, { error: true });
    closePlugin();
  }
}

export async function runFillWithImageUrl() {
  const { selection } = currentPage;
  const item = selection[0];
  try {
    if (selection.length !== 1 || !item || !("fills" in item)) {
      throw new Error("Select one fillable item");
    }
    await fillWithImageUrl(
      "https://images.unsplash.com/photo-1618077360395-f3068be8e001?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1480&q=80",
      item
    );
    closePlugin();
  } catch (error: any) {
    notify(error.message, { error: true });
    closePlugin();
  }
}
