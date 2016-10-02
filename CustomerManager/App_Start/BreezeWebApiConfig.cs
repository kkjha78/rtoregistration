using System.Web.Http;

[assembly: WebActivator.PreApplicationStartMethod(
    typeof(VehicleManager.App_Start.BreezeWebApiConfig), "RegisterBreezePreStart")]
namespace VehicleManager.App_Start {
  public static class BreezeWebApiConfig {

    public static void RegisterBreezePreStart() {
      GlobalConfiguration.Configuration.Routes.MapHttpRoute(
          name: "BreezeApi",
          routeTemplate: "breeze/{controller}/{action}"
      );
    }
  }
}