import { useState } from 'react';

export const useModal = (defaultValue = false) => {
  const [isShow, setVisible] = useState(defaultValue);

  const handleShowModal = () => {
    setVisible(true);
  };

  const handleHideModal = () => {
    setVisible(false);
  };

  const handleToggle = () => {
    setVisible((prevState) => !prevState);
  };

  return { isShow, handleShowModal, handleHideModal, handleToggle };
};
