import React from 'react';
import Image from 'next/image';
import { YoutubeVideo } from '@/app/_types/YoutubeVideo';
import CardOptions from '@/app/_types/CardOptions';
import { parseDate, parseDuration, parseViews } from "@/app/lib/parser/dataParser"

interface cardData {
    cardOptions: CardOptions,
    youtubeVideo: YoutubeVideo
}

const defaultCardOption = {
    size: 1,
    hideTitle: false,
    hideChannel: false,
    hideAuthor: false,
    hideView: false,
    hideDate: false,
    hideDuration: false,
    hideProgressBar: false,
    darkMode: false,
    progressBarPercent: 100
}

const defaultYoutubeVideo = {
    videoId: "XEO3duW1A80",
    url: "https://www.youtube.com/watch?v=XEO3duW1A80",
    urlThumbnail: "https://img.youtube.com/vi/XEO3duW1A80/maxresdefault.jpg",
    urlThumbnailChannel: "https://yt3.ggpht.com/ePr4Q4DVIpU8GBSk0bAkias_6GJivzuuiHQQb804UT9eNw3BbEUWNhV9dLIjIbWf7SZbLa6tYg",
    title: "Je quitte mon CDI de Designer",
    author: "BastiUI",
    duration: 'PT9M27S',
    views: 30000,
    publishedDatetime: '2022-08-14T02:00:23-07:00'
}

const ImgCard: React.FC<cardData> = ({cardOptions = defaultCardOption, youtubeVideo = defaultYoutubeVideo}) => {
    
    let backgroundColorCard = "#fff";
    let colorTitle = "#000";
    let colorInfos = "#606060";
    if(cardOptions.darkMode) {
        backgroundColorCard = "#000";
        colorTitle = "#fff";
        colorInfos = "#a0a0a0";
    }

    return (
        <>
            <div id={youtubeVideo.videoId}
            style={{
                background: backgroundColorCard,
                width: 'auto',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                borderRadius: '2rem',
                padding: '2rem',
                margin: '0 auto',
            }}
            >
            <div style={{
                    display: 'flex',
                    width: '100%',
                    maxHeight: '300px',
                    borderRadius: '1rem',
                    position: 'relative',
                    overflow: 'hidden',
                }} 
                >
                <Image src={youtubeVideo.urlThumbnail!} overrideSrc={youtubeVideo.urlThumbnail!} alt="Vignette" width="1280" height="720" style={{
                    width: '100%',
                    maxHeight: '300px',
                    borderRadius: '1rem',
                }}></Image>

                {!cardOptions.hideDuration && 
                    <h4 style={{
                            background: 'rgba(0, 0, 0, 0.8)',
                            fontSize: '0.8rem',
                            color: '#fff',
                            position: 'absolute',
                            bottom: '13px',
                            right: '10px',
                            padding: '2px 7px',
                            borderRadius: '7px'
                    }}><span className="video-duration" style={{ position: 'relative' }}>{ parseDuration(youtubeVideo.duration!) }</span></h4>
                }

                {!cardOptions.hideProgressBar && 
                    <div style={{
                        width: '100%',
                        height: '5px',
                        background: '#404040',
                        position: 'absolute',
                        bottom: '0px',
                        borderRadius: '1rem'
                    }}></div>
                }

                {!cardOptions.hideProgressBar && 
                    <div style={{
                        width: `${cardOptions.progressBarPercent}%`,
                        height: '5px',
                        background: 'red',
                        position: 'absolute',
                        bottom: '0px',
                        borderRadius: '1rem'
                    }}></div>
                }
            </div>

            <div style={{ 
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginTop: '0.5rem'
            }}>
                
                {!cardOptions.hideChannel && youtubeVideo.urlThumbnailChannel && (
                <div style={{ 
                    display: 'flex',
                    marginRight: '0.5rem'
                }}>
                    <Image src={youtubeVideo.urlThumbnailChannel} overrideSrc={youtubeVideo.urlThumbnailChannel} width="80" height="80" alt="channel" style={{
                        width: '80px',
                        maxWidth: '80px',
                        height: '80px',
                        borderRadius: '40px',
                    }}></Image>
                </div>
                )}

                <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    flexGrow: '1',
                }}>
                    {!cardOptions.hideTitle && 
                        <h1 style={{ 
                            color: colorTitle,
                            fontSize: '1rem',
                            fontWeight: '700',
                            textAlign: 'left',
                            display: 'block',
                            margin: '0 0 0.5rem 0',
                            textOverflow: 'clip',
                        }}>{ youtubeVideo.title }</h1>
                    }
                    
                    {!cardOptions.hideAuthor && 
                        <h2 style={{
                            color: colorInfos,
                            fontWeight: '500',
                            margin: '0 0 0.25rem 0',
                            fontSize: '0.8rem',
                        }}>{ youtubeVideo.author }</h2>
                    }

                    <div style={{
                        display: 'flex',
                        color: colorInfos,
                        alignItems: 'center',
                        fontSize: '0.8rem',
                    }}>
                        {!cardOptions.hideView && <span style={{ marginRight: '0.5rem' }}>{ parseViews(youtubeVideo.views!) }</span>}
                        {!cardOptions.hideDate && <span>Il y a { parseDate(youtubeVideo.publishedDatetime!) }</span>}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ImgCard;