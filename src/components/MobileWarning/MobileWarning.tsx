import React from 'react';
import Modal from '@src/components/Modal'
import { useI18n } from "react-simple-i18n";

const MobileWarning = (): JSX.Element => {
  const [showWarning, setShowWarning] = React.useState(true);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const { t } = useI18n();

  if (isMobile && showWarning) {
    return (
      <Modal
        titles={[]}
        previousRoute="/"
        subtitles={[t("mobileWarning.title")]}
        footer=""
        overrideCloseFunction={() => setShowWarning(false)}
      >
      <div>{t("mobileWarning.text")}</div>
    </Modal>
    );
  }
  return <></>;
}

export default MobileWarning;