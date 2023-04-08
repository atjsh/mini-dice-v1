import { FooterWidgetComponent } from '../components/footer-widget/footer-widget.component';
import { HealthCheckComponent } from '../components/health-check/health-check.component';
import openstreetmapDarkImageUrl from '../assets/openstreetmap-dark.png';
import openstreetmapWhiteImageUrl from '../assets/openstreetmap.png';

export const ServiceLayout: React.FC<{
  hideFooter?: boolean;
  children: React.ReactNode;
}> = ({ children, hideFooter }) => (
  <>
    <HealthCheckComponent />
    <div className="flex flex-col gap-14">
      <div className="flex flex-col select-none">
        <img
          className="object-cover h-32 dark:hidden"
          src={openstreetmapWhiteImageUrl}
          alt=""
        />
        <img
          className="object-cover h-32 hidden dark:block w-[calc(100vw+10rem)]"
          src={openstreetmapDarkImageUrl}
          alt=""
        />
        <div className=" text-gray-500 text-right text-xs mr-1">
          <a href="https://www.openstreetmap.org/" className=" hover:underline">
            Map Image © OpenStreetMap contributors
          </a>
        </div>
      </div>

      <div className=" px-6">{children}</div>
      {hideFooter == false || hideFooter === undefined ? (
        <FooterWidgetComponent />
      ) : (
        <></>
      )}
    </div>
  </>
);
