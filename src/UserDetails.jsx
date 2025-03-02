import Container from "./components/Container";
import TopMenu from "./components/TopMenu";
import { TextAreaInput, TextInput } from "./components/inputFields";
import Title from "./components/Title";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAddress,
  updateGoogleMapsLink,
  updateName,
  updatePhoneNumber,
} from "./redux/appSlice";
import { User } from "./utils/list";

function UserDetails() {
  const data = useSelector((state) => state.app);
  const dispatch = useDispatch();

  return (
    <Container>
      <TopMenu />

      <div className="px-[20px]">
        <Title text="Your details" />

        {/* Alert Message */}
        <div className="bg-blue-100 text-blue-700 p-3 rounded-lg">
          Fill these details to add them in the generated PDF.
        </div>

        <div className="flex flex-col gap-[20px] mt-[20px]">
          <TextInput
            label={"Name"}
            value={data.ownerName}
            placeholder="Your name"
            setValue={(value) => {
              dispatch(updateName(value));
            }}
          />

          <TextInput
            label="Phone Number"
            description="Enter your 10-digit phone number. Only Indian numbers (starting with 6, 7, 8, or 9) are supported."
            value={data.ownerPhoneNumber}
            placeholder="Enter your phone number"
            setValue={(value) => dispatch(updatePhoneNumber(value))}
            errorMessage={
              User.validatePhoneNumber(data.ownerPhoneNumber) ||
              data.ownerPhoneNumber === ""
                ? ""
                : "Invalid phone number. Must be 10 digits and start with 6, 7, 8, or 9."
            }
          />

          <TextAreaInput
            label={"Address"}
            description="Add Your Address for Easy Contact"
            value={data.ownerAddress}
            placeholder=""
            setValue={(value) => {
              dispatch(updateAddress(value));
            }}
          />

          <TextInput
            label={"Google Maps Link"}
            value={data.googleMapsLink}
            placeholder="eg. https://maps.app.goo.gl/dS14Z6J8XFe4s3rU8"
            setValue={(value) => {
              dispatch(updateGoogleMapsLink(value));
            }}
            errorMessage={
              User.validateGoogleMapsLink(data.googleMapsLink) ||
              data.googleMapsLink === ""
                ? ""
                : "Invalid Google Maps Link"
            }
            description="Add Your Google Maps Link to Your Home, Building, or Apartment Location for Easy Navigation"
          />
        </div>
      </div>
    </Container>
  );
}

export default UserDetails;
