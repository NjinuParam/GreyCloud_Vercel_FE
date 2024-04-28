import { cn } from "@/lib/utils";
import Link from "next/link";

export const SidebarSection = ({
  section,
  isActive,
}: {
  section: any;
  isActive: (path: string) => boolean;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs uppercase tracking-widest text-primary">
        {section.heading}
      </h2>
      <ul className="flex flex-col gap-2">
        {section.links.map((link: any) => (
          <li
            key={link.title}
            className={cn(
              "flex items-center gap-3 text-base p-2 rounded-md cursor-pointer transition-all duration-200 ease-in-out hover:bg-primary/95 hover:text-white",
              isActive(link.path) && "font-bold bg-primary text-white"
            )}
          >
            {link.icon}
            <Link
              href={link.path}
              className={isActive(link.path) ? "font-bold" : ""}
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
