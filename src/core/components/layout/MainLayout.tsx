import { useDocumentTitle } from '@/core/hooks/utils/useDocumentTitle'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {

    useDocumentTitle("Clean House")

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-background">
            <div className="w-[430px] mx-auto bg-card h-[100vh] max-h-screen md:h-[1000px] overflow-hidden shadow-xl">
                <div className="full-height flex flex-col">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}
