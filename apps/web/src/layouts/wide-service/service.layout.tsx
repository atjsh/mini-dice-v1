import { FooterWidgetComponent } from '../../components/footer-widget/footer-widget.component';

export const ServiceLayout: React.FC = ({ children }) => (
  <div className="flex flex-col gap-14">
    <div className="flex flex-col select-none">
      <img
        className="object-cover h-32"
        src={new URL('~/src/assets/openstreetmap.png', import.meta.url).href}
        alt=""
      />
      <div className=" text-gray-500 text-right text-xs mr-1">
        <a href="https://www.openstreetmap.org/" className=" hover:underline">
          Map Image © OpenStreetMap contributors
        </a>
      </div>
    </div>

    <div className=" px-6">{children}</div>
    <FooterWidgetComponent />
  </div>
);
