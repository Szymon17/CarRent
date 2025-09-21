import "./profile.styles.sass";
import { FormEvent, useEffect, useState } from "react";
import { userUpdate } from "../../store/user/user.types";
import { validate } from "../../utils/basicFunctions";
import { updateUserFetch } from "../../utils/fetchFunctions";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectNextUpdateTime, selectUser } from "../../store/user/user.selectors";
import { logOut, updateUserState } from "../../store/user/user.reducer";
import { useTranslation } from "react-i18next";
import FormInput from "../../components/formInput/formInput.component";
import Button, { BUTTON_CLASSES } from "../../components/button/button.component";

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [email, setEmail] = useState(user?.email);
  const [name, setName] = useState(user?.name);
  const [surname, setSurname] = useState(user?.surname);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
  const nextUpdateTime = useAppSelector(selectNextUpdateTime);

  const [timeToUpdate, setTimeToUpdate] = useState(new Date().getTime());

  useEffect(() => {
    const intervalIndex = setInterval(() => setTimeToUpdate(new Date().getTime()), 1000);

    return () => {
      clearInterval(intervalIndex);
    };
  }, []);

  const updateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      const fieldsToUpdate: userUpdate = { email: user.email };

      if (email && email !== user.email && validate.email(email)) fieldsToUpdate.newEmail = email;
      if (name && name !== user.name && validate.name(name)) fieldsToUpdate.name = name;
      if (surname && surname !== user.surname && validate.name(surname)) fieldsToUpdate.surname = surname;
      if (phoneNumber && phoneNumber !== user.phoneNumber && validate.phoneNumber(phoneNumber)) fieldsToUpdate.phoneNumber = phoneNumber;

      const status = await updateUserFetch(fieldsToUpdate);

      if (status?.status === "ok") {
        dispatch(updateUserState(status.nextUpdateTime));
        dispatch(logOut());
      }
    } else console.log("User not found");
  };

  const calculateDelayTime = (): string => {
    const time = nextUpdateTime - timeToUpdate;

    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));

    return `${minutes > 9 ? minutes : "0" + minutes}:${seconds > 9 ? seconds : "0" + seconds}`;
  };

  return (
    <form onSubmit={updateUser} method="put" className="profile">
      <div className="profile__inputs">
        <FormInput value={email} onChange={e => setEmail(e.target.value)} label="Email" />
        <FormInput value={name} onChange={e => setName(e.target.value)} label={t("Name")} />
        <FormInput value={surname} onChange={e => setSurname(e.target.value)} label={t("Surname")} />
        <FormInput value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} label={t("Phone number")} />
      </div>
      {nextUpdateTime < timeToUpdate ? (
        <Button type="submit">{t("Save")}</Button>
      ) : (
        <Button buttonType={BUTTON_CLASSES.disable} onClick={e => e.preventDefault()}>
          {`${calculateDelayTime()}`}
        </Button>
      )}
    </form>
  );
};

export default Profile;
