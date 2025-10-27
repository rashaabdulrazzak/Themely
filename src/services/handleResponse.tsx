import { Bounce, toast } from "react-toastify";
import { authLogout } from ".";
import { emptyData, mainRequestNeededEmptyData } from "./requestedData";

/* export const handleResponse = (
  response: any,
  page?: string,
  requestType?: string
) => {
  if (response === undefined) {
    handleError(response.response.data.errors);
  } else if (response.status === 200) {
    console.log("Response data:", response.data);
    const result = response.data.data;

    if (response.data.pagination) {
      result["pagination"] = response.data.pagination;
    }

    if (requestType === "Post" || requestType === "Delete") {
      handleSuccess(response?.data?.message);
    }

    if (Array.isArray(result) && result.length > 0) {
      return result;
    } else if (typeof result === "object" && !Array.isArray(result) && result) {
        console.log("$$$$$$$$$$$",response.data.token)
        if(response.data.token !== undefined){
             console.log("here")
          localStorage.setItem("token", response.data.token);
          const  token = response.data.token;
          return { ...result, token  };
        }
        
      return result;
    } else {
      if (page && mainRequestNeededEmptyData.includes(page)) {
        return emptyData[page!.toLowerCase()];
      } else if (typeof result === "string") {
        return { data: result };
      } else {
        return [];
      }
    }
  } else {
    handleError(response.response.data.errors);
  }
}; */
export const handleResponse = (response: any, page?: string, requestType?: string) => {
  if (response === undefined) {
    handleError(response.response.data.errors);
  } else if (response.status === 200) {
    console.log("Response data:", response.data);

    const result = response.data.data ?? response.data;

    if (response.data.pagination) {
      result["pagination"] = response.data.pagination;
    }

    if (requestType === "Post" || requestType === "Delete") {
      handleSuccess(response?.data?.message);
    }

    if (Array.isArray(result) && result.length > 0) {
      return result;
    } else if (typeof result === "object" && !Array.isArray(result) && result) {
      if (response.data.token !== undefined) {
        localStorage.setItem("token", response.data.token);
        return { ...result, token: response.data.token };
      }
      return result;
    } else {
      if (page && mainRequestNeededEmptyData.includes(page)) {
        return emptyData[page!.toLowerCase()];
      } else if (typeof result === "string") {
        return { data: result };
      } else {
        return [];
      }
    }
  } else {
    handleError(response.response.data.errors);
  }
};

export const handleError = async (error: any) => {
    console.log("Handling error:", error);
  if (error?.response?.status === 401 ) {
    localStorage.clear();
    await authLogout();
    window.location.href = "/login";
  } else if (error?.response?.status === 403) {
    console.error("Forbidden:", error);
    const messageError = error?.response?.data?.message
      ? error?.response?.data?.message
      : "You do not have permission to perform this action";

    toast(messageError, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "dark",
      transition: Bounce,
      style: { backgroundColor: "#0E1530", color: "#fff" },
    });
  }else if (error?.response?.status === 400) {
    console.error("bad request:", error);
    const messageError = error?.response?.data?.message
      ? error?.response?.data?.message
      : "not valid request";
     console.error("bad request:", messageError);
    toast(messageError, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "dark",
      transition: Bounce,
      style: { backgroundColor: "#0E1530", color: "#fff" },
    });
     window.location.href = "/login";
  }
   else {
    console.error("Error response:", error);
    const messageError = error?.response?.data?.errors[0]
      ? error?.response?.data?.errors[0]
      : "an error has happened";

    toast(messageError, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "dark",
      transition: Bounce,
      style: { backgroundColor: "#0E1530", color: "#fff" },
    });
  }
};

export const handleSuccess = (response?: any) => {
  const message = response
    ? response
    : "The process was completed successfully";

  toast(message, {
    position: "top-right",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",

    transition: Bounce,
    style: { backgroundColor: "#caf1d8", color: "#1da750" },
  });
};
