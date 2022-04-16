export const WordmarkComponent: React.FC = () => (
  <>
    Mini <span className="text-minidice_red">Dice</span>{' '}
    <span
      className={`text-xl tracking-normal font-normal ${
        process.env.WEB_VERSION_KIND === 'beta' ? '' : 'hidden'
      }`}
    >
      (베타)
    </span>
  </>
);
