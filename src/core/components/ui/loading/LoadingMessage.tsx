import { useParams } from 'react-router-dom'
import { useForm as useGetForm } from '@/core/hooks/api/useForm'
import { useEffect, useState, useRef } from 'react'

export const LoadingMessage = () => {
    const { formId } = useParams()
    const { data: _form } = useGetForm(formId!)
    const [phraseIdx, setPhraseIdx] = useState(0)
    const [fade, setFade] = useState(true)
    const gifRef = useRef<HTMLImageElement>(null)
    const textRef = useRef<HTMLSpanElement>(null)

    // Массив фраз для отображения
    const phrases: string[] = [
        "Анализируем данные...",
        "Обрабатываем ответы...",
        "Формируем отчет...",
        "Почти готово...",
        "Завершаем обработку..."
    ];

    // Синхронизация с гифкой
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false)
            setTimeout(() => {
                setPhraseIdx((prev) => (prev + 1) % phrases.length)
                setFade(true)
            }, 200)
        }, 3000)

        return () => clearInterval(interval)
    }, [phrases.length])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-card to-secondary p-6">
            <div className="text-center max-w-md">
                <div className="mb-8">
                    <img
                        ref={gifRef}
                        src="/Robot.gif"
                        alt="Loading animation"
                        className="w-32 h-32 mx-auto"
                    />
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground mb-4">
                        Обработка данных
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        Пожалуйста, подождите пока мы обрабатываем ваши данные
                    </p>
                </div>

                <div className="mb-8">
                    <span
                        ref={textRef}
                        className={`text-lg text-primary transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        {phrases[phraseIdx]}
                    </span>
                </div>

                <div className="w-full bg-secondary rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
            </div>
        </div>
    )
}
