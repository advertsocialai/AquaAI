import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Store URLs (mirror the constants used in the Footer).
// NOTE: the App Store id is still a placeholder until the live listing exists.
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=in.aquai.mobile";
export const APP_STORE_URL =
  "https://apps.apple.com/in/app/aqua-rudra/id0000000000";

type StoreButtonProps = Omit<React.ComponentProps<typeof Button>, "children"> & {
  /** When set, the button renders as an external link to the store. */
  href?: string;
};

export function AppStoreButton({ className, href, ...props }: StoreButtonProps) {
  const content = (
    <>
      <AppleIcon className="size-5" />
      <div className="text-left flex flex-col items-start justify-center pr-2">
        <span className="text-[10px] leading-none tracking-tighter">
          Download on the
        </span>
        <p className="text-base font-bold leading-none">App Store</p>
      </div>
    </>
  );

  if (href) {
    return (
      <Button asChild className={cn("h-11 gap-2", className)} {...props}>
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store">
          {content}
        </a>
      </Button>
    );
  }

  return (
    <Button className={cn("h-11 gap-2", className)} {...props}>
      {content}
    </Button>
  );
}

export function GooglePlayButton({ className, href, ...props }: StoreButtonProps) {
  const content = (
    <>
      <GooglePlayIcon className="size-5" />
      <div className="text-left flex flex-col items-start justify-center pr-2">
        <span className="text-[10px] leading-none tracking-tighter">
          Get it on
        </span>
        <p className="text-base font-bold leading-none">Google Play</p>
      </div>
    </>
  );

  if (href) {
    return (
      <Button asChild className={cn("h-11 gap-2", className)} {...props}>
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play">
          {content}
        </a>
      </Button>
    );
  }

  return (
    <Button className={cn("h-11 gap-2", className)} {...props}>
      {content}
    </Button>
  );
}

/** Both store buttons in a responsive row, pre-wired to the store URLs. */
export function StoreButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      <AppStoreButton href={APP_STORE_URL} />
      <GooglePlayButton href={PLAY_STORE_URL} />
    </div>
  );
}

function AppleIcon({ fill = "currentColor", ...props }: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} {...props}>
      <g id="_Group_2">
        <g id="_Group_3">
          <path
            id="_Path_"
            d="M18.546,12.763c0.024-1.87,1.004-3.597,2.597-4.576c-1.009-1.442-2.64-2.323-4.399-2.378    c-1.851-0.194-3.645,1.107-4.588,1.107c-0.961,0-2.413-1.088-3.977-1.056C6.122,5.927,4.25,7.068,3.249,8.867    c-2.131,3.69-0.542,9.114,1.5,12.097c1.022,1.461,2.215,3.092,3.778,3.035c1.529-0.063,2.1-0.975,3.945-0.975    c1.828,0,2.364,0.975,3.958,0.938c1.64-0.027,2.674-1.467,3.66-2.942c0.734-1.041,1.299-2.191,1.673-3.408    C19.815,16.788,18.548,14.879,18.546,12.763z"
          />
          <path
            id="_Path_2"
            d="M15.535,3.847C16.429,2.773,16.87,1.393,16.763,0c-1.366,0.144-2.629,0.797-3.535,1.829    c-0.895,1.019-1.349,2.351-1.261,3.705C13.352,5.548,14.667,4.926,15.535,3.847z"
          />
        </g>
      </g>
    </svg>
  );
}

function GooglePlayIcon({ fill = "currentColor", ...props }: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} {...props}>
      <path d="M3 20.5V3.5c0-.4.4-.7.8-.5l13 8.5c.4.2.4.8 0 1l-13 8.5c-.4.2-.8-.1-.8-.5z" />
    </svg>
  );
}
