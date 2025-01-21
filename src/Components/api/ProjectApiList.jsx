
// import BackendUrl from "./BackendUrl";

import BackendUrl from "./BackendUrl";

export default function ProjectApiList() {
  let baseUrl = BackendUrl;
  let apiList = {

    checkPropertyService: `${baseUrl}/get/services-by-module`,
    getPermittedServiceList: `${baseUrl}/get/services-b-ulb-id`,
    getMenuByModule: `${baseUrl}/api/menu/by-module`,
  };

  return apiList;
}
