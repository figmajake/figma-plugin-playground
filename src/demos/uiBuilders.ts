interface UIBuilderResponse<T> {
  data: T;
}

interface MessageError {
  type: "error";
  data: string;
}
interface MessageSuccess<T> {
  type: "success";
  data: T;
}
type Message<T> = MessageError | MessageSuccess<T>;

export async function retrieveData<T>(
  url: string
): Promise<UIBuilderResponse<T>> {
  return new Promise((resolve, reject) => {
    figma.showUI(
      `<script>
      (async () => {
        try {
          const response = await fetch("${url}");
          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }
          parent.postMessage({ pluginMessage: { type: "success", data } }, "*");
        } catch({ message }) {
          parent.postMessage({ pluginMessage: { type: "error", data: message } }, "*");
        }
      })();
      </script>`,
      { visible: false }
    );
    figma.ui.onmessage = async (message: Message<T>) => {
      if (message.type === "success") {
        resolve({ data: message.data });
      } else {
        reject(Error(message.data));
      }
    };
  });
}
