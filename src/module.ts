import { Styler } from "./styler";
import { RedocTryItOutOptions } from "./interfaces/redoc-try-it-out-options.interface";
import { SwaggerWrapper } from "./wrappers/swagger.wrapper";
import { RedocWrapper } from "./wrappers/redoc.wrapper";
import { AuthBtn } from "./elements/auth.btn";
import { TryBtn } from "./elements/try.btn";
import { SwaggerConfig } from "./config/swagger-config";
import { RedocTryItOutConfig } from "./config/redoc-try-it-out-config";
import { AuthBtnConfig } from "./config/auth-btn-config";
import { TryBtnConfigConfig } from "./config/try-btn-config";
import { StyleMatcherConfig } from "./config/style-matcher.config";

export class RedocTryItOut {
  private static async loadAll(): Promise<void[]> {
    return Promise.all([RedocWrapper.init(), SwaggerWrapper.init()]);
  }

  private static config(
    url: string,
    cfg: RedocTryItOutOptions,
    element?: HTMLElement,
  ): void {
    RedocWrapper.cfg = new RedocTryItOutConfig(url, cfg, element);

    if (RedocWrapper.cfg.tryItOutEnabled) {
      SwaggerWrapper.cfg = new SwaggerConfig(
        cfg.swaggerOptions || {},
        url,
        true,
      );
      AuthBtn.cfg = new AuthBtnConfig(cfg.authBtn || {});
      TryBtn.cfg = new TryBtnConfigConfig(cfg.tryBtn || {});
      Styler.cfg = new StyleMatcherConfig(
        cfg.stylerMatcher || {},
        SwaggerWrapper.cfg,
        RedocWrapper.cfg,
      );
    }
  }

  public static async init(
    docUrl: string,
    cfg: RedocTryItOutOptions,
    element?: HTMLElement,
  ): Promise<void> {
    // This parses and sets the config on the static cfg property on the RedocWrapper class
    RedocTryItOut.config(docUrl, cfg, element);

    if (RedocWrapper.cfg.disableZenscroll) {
      (window as any).noZensmooth = true;
    }

    if (RedocWrapper.cfg.tryItOutEnabled) {
      await RedocTryItOut.loadAll();
      AuthBtn.init();
      TryBtn.init();
      Styler.init();
    } else {
      await RedocWrapper.init();
    }
  }
}
