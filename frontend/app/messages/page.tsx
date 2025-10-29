"use client"

import {BellRing, Check, CheckCheck} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card"
import {useLanguage} from "@/lib/language-context"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React, {useEffect, useState} from "react";
import {useApi} from "@/lib/api";
import {useAuth} from "@/lib/auth-context";
import {ConversationDto} from "@/components/object/ConversationDto";
import {Textarea} from "@/components/ui/textarea";


export default function PrivacyPolicy() {
    const {t} = useLanguage()
    const {apiGet, apiPost, apiPatch} = useApi()
    const {token, user} = useAuth()
    const [conversations, setConversations] = useState<ConversationDto[]>([])
    const [conversation, setConversation] = useState<ConversationDto | null>(null)
    const [previousMessage, setPreviousMessage] = useState('')
    const [textareaMessage, setTextareaMessage] = useState('')
    const [offerState, setOfferState] = useState('ignore')

    useEffect(() => {
        if (!token) return;
        apiGet("/api/conversations").then(res => {
            setConversations(res)
        })
    }, [token])


    function sendMessageIntoConversation(conversation: ConversationDto) {
        if (textareaMessage === '' || textareaMessage === previousMessage) return;
        setPreviousMessage(textareaMessage)

        apiPost(`/api/conversations/${conversation.id}/response`, {
            message: textareaMessage,
            offerState: offerState
        }).then(res => {
            setTextareaMessage('')
            setConversation(res)
            setConversations(prev => prev.map(c => {
                if (c.id === res.id) {
                    return res
                }
            }))
        })
    }

    const setRead = (conversation: ConversationDto) => {
        apiPatch(`/api/conversations/${conversation.id}`, {
            read: true,
        }).then(res => {
            setConversations(prev => prev.map(c => {
                if (c.id === res.id) {
                    return res
                }
            }));
            setConversation(res)
        })
    }
    return (<>
            <Navbar></Navbar>
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-foreground">{t('conversation.title')}</h3>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - User Info */}
                    <div className="lg:col-span-1">
                        <Card noPadding={true} className="sticky top-24 p-2">
                            <CardContent className="px-2 py-2">
                                {conversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        onClick={() => {
                                            if (textareaMessage !== '') {
                                                if (!confirm('Vous allez perdre le message rédigé continuer quand même ?')) {
                                                    return false;
                                                }
                                            }
                                            setTextareaMessage('')
                                            setConversation(conversation)
                                            setRead(conversation)
                                        }
                                        }
                                        className="flex items-center space-x-4 p-1 rounded-lg border  hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all relative duration-200"
                                    >
                                        <img
                                            className="w-16 h-12 rounded-sm object-cover "
                                            src={conversation.pinball.images[0].url}
                                            alt={conversation.pinball.name}
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {conversation.userA.id != user?.id && conversation.userA.name}
                                                {conversation.userB.id != user?.id && conversation.userB.name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {conversation.pinball.name}
                                            </span>

                                            
                                            {conversation.messages.some(message => !message.isRead && message.sender.id !== user?.id) && (<BellRing className={'absolute -top-1 -right-1 text-destructive w-4 h-4'}></BellRing>)}
                                        </div>
                                    </div>
                                ))
                                }
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="space-y-6">
                            {conversation === null ? (
                                <Card className="grid grid-cols-1">
                                    <div className="text-muted-foreground">
                                        <p className="text-lg pl-6">{t('conversation.selectAConversation')}</p>
                                    </div>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {conversation && conversation.messages.map((message) => (
                                        <Card
                                            noPadding={true}
                                            key={message.id}
                                            className={`group hover:shadow-lg transition-all duration-200 w-[66.66%] ${
                                                message.sender.id === user?.id
                                                    ? 'ml-auto'
                                                    : 'mr-auto'
                                            }`}
                                        >
                                            <CardContent className={`pt-3 relative ${
                                                message.sender.id === user?.id
                                                    ? 'bg-primary/10'
                                                    : 'bg-secondary/10'
                                            }`}>
                                                <div>{message.sender.name}</div>
                                                <div className="text-sm text-muted-foreground line-clamp-2">
                                                    {message?.content || "..."}
                                                    {message?.offerAmount && (
                                                        <div className="text-primary font-bold">
                                                            {t('conversation.offer')} : <span
                                                            className={'text-primary'}>€{message.offerAmount}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <small className={'flex justify-end items-center'}>
                                                    {message.isRead ?
                                                        <span className={'text-primary flex justify-end  gap-1'}>
                                                            <CheckCheck className={'w-4 h-4'}></CheckCheck>
                                                            {t('conversation.read')}
                                                        </span>:
                                                        <span className={'text-gray-500 flex justify-end  gap-1'}>
                                                            <Check className={'w-4 h-4'}></Check>
                                                            {t('conversation.sent')}
                                                        </span>}
                                                </small>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    <Card noPadding={true}
                                          className="group hover:shadow-lg transition-all duration-200 w-[66.66%] ml-auto gap-0">
                                        <CardHeader className="p-3 pb-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center">
                                                    <div
                                                        className="grid grid-cols-12 text-muted-foreground">
                                                        {t('conversation.newMessage')}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-3">
                                            <Textarea onChange={(e) => {
                                                setTextareaMessage(e.target.value)
                                            }} value={textareaMessage}></Textarea>
                                            {/*<div className="mt-4">*/}
                                            {/*    <RadioGroup defaultValue="ignore"*/}
                                            {/*                value={offerState}*/}
                                            {/*                className={'flex items-baseline space-x-2'}*/}
                                            {/*                onValueChange={(value) => setOfferState(value)}>*/}
                                            {/*        <div >*/}
                                            {/*           <TooltipProvider >*/}
                                            {/*            <Tooltip >*/}
                                            {/*                <TooltipTrigger className="flex items-center space-x-2 cursor-pointer">*/}
                                            {/*                    <RadioGroupItem value="ignore" id="ignore" className={'cursor-pointer'}/>*/}
                                            {/*                    <label className={'cursor-pointer'} htmlFor="ignore">{t('conversation.ignoreOffer')}</label>*/}
                                            {/*                </TooltipTrigger>*/}
                                            {/*                <TooltipContent>{t('conversation.ignoreOfferHelper')}</TooltipContent>*/}
                                            {/*            </Tooltip>*/}
                                            {/*           </TooltipProvider>*/}
                                            {/*        </div>*/}
                                            {/*        <div>*/}
                                            {/*            <TooltipProvider>*/}
                                            {/*                <Tooltip >*/}
                                            {/*                    <TooltipTrigger className="flex items-center space-x-2 cursor-pointer">*/}
                                            {/*                        <RadioGroupItem className={'cursor-pointer'} value="accept" id="accept"/>*/}
                                            {/*                        <label className={'cursor-pointer'} htmlFor="accept">{t('conversation.acceptOffer')} </label>*/}
                                            {/*                    </TooltipTrigger>*/}
                                            {/*                    <TooltipContent>{t('conversation.acceptOfferHelper')}</TooltipContent>*/}
                                            {/*                </Tooltip>*/}
                                            {/*            </TooltipProvider>*/}
                                            {/*        </div>*/}
                                            {/*        <div>*/}
                                            {/*            <TooltipProvider>*/}
                                            {/*                <Tooltip >*/}
                                            {/*                    <TooltipTrigger className="flex items-center space-x-2 cursor-pointer">*/}
                                            {/*                        <RadioGroupItem className={'cursor-pointer'} value="refuse" id="refuse"/>*/}
                                            {/*                        <label className={'cursor-pointer'} htmlFor="refuse">{t('conversation.refuseOffer')} </label>*/}
                                            {/*                        /!*<InfoIcon className={'w-4 h-4 cursor-help'} ></InfoIcon>*!/*/}
                                            {/*                    </TooltipTrigger>*/}
                                            {/*                    <TooltipContent>{t('conversation.refuseOfferHelper')}</TooltipContent>*/}
                                            {/*                </Tooltip>*/}
                                            {/*            </TooltipProvider>*/}
                                            {/*        </div>*/}
                                            {/*    </RadioGroup>*/}
                                            {/*</div>*/}

                                        </CardContent>
                                        <CardFooter className="p-3 ">
                                            <Button className={'ml-auto cursor-pointer'}
                                                    onClick={() => sendMessageIntoConversation(conversation)}>{t('conversation.send')}</Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}
