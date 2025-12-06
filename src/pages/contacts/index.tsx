import { MapPin, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';

export const ContactsPage = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Контакты
                    </h1>
                    <p className="text-xl text-gray-600">
                        Свяжитесь с нами для заказа услуг клининга
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Контактная информация */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Контактная информация
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Телефон</p>
                                    <p className="text-gray-600">8-800-775-63-65</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-gray-600">chisto.doma1@mail.ru</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium">Режим работы</p>
                                    <p className="text-gray-600">Пн-Вс: 8:00 - 22:00</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Адрес */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Наш адрес
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="font-medium mb-2">Юридический адрес:</p>
                                    <p className="text-gray-600 leading-relaxed">
                                        188689, Ленинградская область,<br />
                                        Всеволожский район,<br />
                                        гп Янино-1,<br />
                                        ул Шоссейная, д. 48Е, стр. 6
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Реквизиты компании */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Реквизиты компании
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div>
                                    <p className="font-medium text-gray-900">Полное наименование</p>
                                    <p className="text-gray-600">Общество с ограниченной ответственностью "ЧИСТО ДОМА"</p>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-900">Сокращенное наименование</p>
                                    <p className="text-gray-600">ООО "ЧИСТО ДОМА"</p>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-900">ИНН</p>
                                    <p className="text-gray-600">4706092515</p>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-900">КПП</p>
                                    <p className="text-gray-600">470601001</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="font-medium text-gray-900">ОГРН</p>
                                    <p className="text-gray-600">1254700016548</p>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-900">Юридический адрес</p>
                                    <p className="text-gray-600">
                                        188689, Ленинградская область,<br />
                                        Всеволожский район,<br />
                                        гп Янино-1,<br />
                                        ул Шоссейная, д. 48Е, стр. 6
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium text-gray-900">Почтовый адрес</p>
                                    <p className="text-gray-600">
                                        ЛЕНИНГРАДСКАЯ ОБЛАСТЬ,<br />
                                        М.Р-Н ВСЕВОЛОЖСКИЙ,<br />
                                        Г.П. ЗАНЕВСКОЕ,<br />
                                        ГП ЯНИНО-1,<br />
                                        УЛ ШОССЕЙНАЯ,<br />
                                        ЗД. 48Е, СТР. 6<br />
                                        индекс 188689
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Услуги */}
                {/* <Card>
                    <CardHeader>
                        <CardTitle>Наши услуги</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-900 mb-2">Генеральная уборка</h3>
                                <p className="text-blue-700 text-sm">Полная уборка квартир и домов</p>
                            </div> 

                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-green-900 mb-2">Выброс мусора</h3>
                                <p className="text-green-700 text-sm">Вынос мусора из квартир и домов</p>
                            </div>

                        </div>
                    </CardContent>
                </Card> */}
            </div>
        </div>
    );
};
