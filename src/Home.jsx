import { useState, useRef, useEffect } from "react";
import Container from "./components/Container";
import { AppBtn } from "./components/Buttons";
import GroceryList, { User } from "./utils/list"; // ✅ Import User for validation
import { TextInputForList } from "./components/inputFields"; // ✅ Import input components
import TopMenu from "./components/TopMenu";
import Title from "./components/Title";
import { useDispatch, useSelector } from "react-redux";
import {
  addListItem,
  clearListItems,
  editListItem,
  removeListItem,
} from "./redux/appSlice";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const data = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (data.ownerName.trim() === "") {
      // navigate("/user-details?nameError=Name is required");
    }
  }, [data.ownerName, navigate]);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // ✅ Toggle Speech Recognition
  const toggleRecording = () => {
    if (
      !("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const speechText = event.results[0][0].transcript;
        console.log("Recognized Speech:", speechText);

        dispatch(addListItem(speechText));
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // ✅ Generate and Download PDF (Using User.validate)
  const generatePdf = () => {
    const groceryList = new GroceryList(data);
    groceryList.download();
  };

  const ListItemsHere = (
    <ul className="">
      {data.list.map((item, index) => (
        <li
          key={index}
          className="bg-white flex py-[10px] gap-[10px] justify-between items-center "
        >
          {/* Editable Input */}
          <TextInputForList
            value={item}
            setValue={(value) => dispatch(editListItem({ index, value }))}
            className="flex-1 border-none focus:ring-0 bg-transparent p-2"
          />

          <img
            onClick={(e) => {
              dispatch(removeListItem(index));
            }}
            src="delete-icon.png"
            alt="Delete"
            width={24}
            height={24}
            style={{ cursor: "pointer" }} // Makes it clear it's clickable
          />
        </li>
      ))}
    </ul>
  );

  return (
    <Container>
      <div className="fixed top-0 left-0 w-full bg-white  z-10">
        <TopMenu />
        <div className="px-[20px]">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center ">
              <Title text="Grocery List" />
              <button
                className="px-3 py-1.5 bg-amber-500 text-white rounded-lg shadow-sm transition-all hover:bg-amber-600"
                onClick={(e) => dispatch(clearListItems())}
              >
                Clear List
              </button>
            </div>

            <p> {data.list.length + " items"}</p>
          </div>
        </div>
      </div>

      <div className="px-[20px] fixed top-[132px] left-0 right-0 bottom-[131px] h-[calc(100vh-132px-80px)] overflow-scroll">
        {data.list.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <img src="items.png" width={170} height={170} />
            <p className="text-[18px] font-bold text-center">
              No items in the list. Click the 'Start Recording' button to begin
              adding items.
            </p>
          </div>
        ) : (
          ListItemsHere
        )}
      </div>

      <div className="fixed flex justify-between bottom-0 left-0 w-full h-[80px] bg-[#efefef] p-4 flex gap-4 z-10">
        <AppBtn
          onClick={toggleRecording}
          type="red"
          icon={isRecording ? "stop-record-icon.png" : "start-record-icon.png"}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </AppBtn>

        <AppBtn
          type="green"
          onClick={generatePdf}
          color="green"
          icon={"download-icon.png"}
        >
          Download PDF
        </AppBtn>
      </div>
    </Container>
  );
}

export default HomePage;
