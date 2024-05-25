import Header from "./component/Header";
import Sidebar from "./component/SideBar";
import LeftSidebar from "./LeftSideBar";
import { PostCall } from "./component/NewsFeed";
import "../App.css"; 

export function MainPage() {
    return (
        <div className="flex flex-wrap gap-1 h-screen" style={{width: '100vw'}}>
            <div className="flex-none h-full overflow-y-auto custom-scrollbar ">
                <Sidebar />
            </div>
            <div className="flex-auto bg-gray-100 h-full overflow-y-auto custom-scrollbar">
                <Header />
                <PostCall />
            </div>
            <div className="flex w-1/5 justify-center h-full overflow-y-auto custom-scrollbar">
                <LeftSidebar />
            </div>
        </div>
    );
}
