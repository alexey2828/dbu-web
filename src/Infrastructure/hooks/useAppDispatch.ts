import {useDispatch} from "react-redux";
import {AppDispatch} from "../../Redux/store";


export const useAppDispatch = () => useDispatch<AppDispatch>();
