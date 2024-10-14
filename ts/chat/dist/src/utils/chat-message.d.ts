import { ApiEntityState } from '@chat-gen';
export declare const isDeletedChatMessage: <T extends Partial<{
    __typename?: Partial<"ChatChatMessage" | undefined>;
    chatId: string;
    content: Partial<{
        __typename?: Partial<"ChatMessageContent" | undefined>;
        content?: Partial<{
            __typename?: Partial<"ChatTextMessage" | undefined>;
            attachments: (Partial<{
                __typename?: Partial<"ChatTextMessageAttachment" | undefined>;
                endIndex: number;
                itemId: string;
                label: string;
                source: string;
                startIndex: number;
            }> | undefined)[];
            text: string;
        } | {
            __typename?: Partial<"ChatTombstone" | undefined>;
            emptyTypeWorkaround: Partial<boolean>;
        } | null | undefined>;
    }>;
    createdAt: string;
    messageId: string;
    moderationStatus: Partial<import("@chat-gen").ChatModerationStatus>;
    sender: Partial<{
        __typename?: Partial<"ProfileProfile" | undefined>;
        account?: Partial<{
            __typename?: Partial<"AuthAccount" | undefined>;
            acceptedTerms: (Partial<{
                __typename?: Partial<"AuthTermsVersion" | undefined>;
                name: string;
                revision: string;
                signature: string;
            }> | undefined)[];
            birthday?: Partial<{
                __typename?: Partial<"AuthDate" | undefined>;
                day: number;
                month: number;
                year: number;
            } | null | undefined>;
            createdAt: string;
            email: string;
            emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
            externalIds: (Partial<{
                __typename?: Partial<"AuthIdentity" | undefined>;
                id: string;
                type: Partial<import("@chat-gen").AuthIdentityType>;
            }> | undefined)[];
            flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
            isBot: Partial<boolean>;
            marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
            matureRatedContentAllowed: Partial<boolean>;
            pendingAgreements: (Partial<{
                __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                name: string;
                revision: string;
                url: string;
            }> | undefined)[];
            roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
            signupOrigin?: Partial<{
                __typename?: Partial<"AuthSignupOrigin" | undefined>;
                origin?: Partial<{
                    __typename?: Partial<"AuthSignupOriginCampaign" | undefined>;
                    campaign: string;
                    content: string;
                    creator: string;
                    format: string;
                    medium: string;
                    source: string;
                    term: string;
                } | {
                    __typename?: Partial<"AuthSignupOriginChannel" | undefined>;
                    channel: Partial<{
                        __typename?: Partial<"ChannelChannel" | undefined>;
                        channelFriends: Partial<{
                            __typename?: Partial<"FriendsChannelFriends" | undefined>;
                            channelId: string;
                            totalCount: number;
                            users: (Partial<{
                                __typename?: Partial<"FriendsUser" | undefined>;
                                activity?: Partial<{
                                    __typename?: Partial<"FriendsActivity" | undefined>;
                                    channel?: Partial<{
                                        __typename?: Partial<"ChannelChannel" | undefined>;
                                        channelFriends: Partial<any>;
                                        currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        currentStreamId: string;
                                        description: string;
                                        features: Partial<{
                                            __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                                            noicePredictions: Partial<any>;
                                            streaming: Partial<any>;
                                        }>;
                                        followerCount: number;
                                        following: Partial<boolean>;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        gameId: string;
                                        id: string;
                                        isPublic: Partial<boolean>;
                                        itemStats: (Partial<{
                                            __typename?: Partial<"ItemItemStat" | undefined>;
                                            counts: (Partial<any> | undefined)[];
                                            gameId: string;
                                        }> | undefined)[];
                                        links: (Partial<{
                                            __typename?: Partial<"ChannelChannelLink" | undefined>;
                                            name: string;
                                            type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                                            url: string;
                                        }> | undefined)[];
                                        liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                        logo: string;
                                        logoUrl: string;
                                        matureRatedContent: Partial<boolean>;
                                        name: string;
                                        offlineBanner: string;
                                        offlineBannerUrl: string;
                                        playedGameIds: (string | undefined)[];
                                        state: Partial<ApiEntityState>;
                                        streamedGames?: Partial<Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>[] | null | undefined>;
                                        streamer: Partial<any>;
                                        streamerId: string;
                                        subscriberCount: number;
                                        subscription?: Partial<{
                                            __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                                            activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            createdAt: string;
                                            expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            id: string;
                                            paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                                            terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            tier: number;
                                            userId: string;
                                        } | null | undefined>;
                                        subscriptionConfig?: Partial<{
                                            __typename?: Partial<"SubscriptionChannelSubscriptionConfig" | undefined>;
                                            channelId: string;
                                            subscriptionsEnabled: Partial<boolean>;
                                            tiers: (Partial<any> | undefined)[];
                                        } | null | undefined>;
                                        suspension: Partial<{
                                            __typename?: Partial<"ChannelSuspension" | undefined>;
                                            description: string;
                                            moderator?: Partial<any | null | undefined>;
                                            reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                            suspendedAt: string;
                                            suspendedBy: string;
                                            until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        }>;
                                        thumbnail: string;
                                        thumbnailUrl: string;
                                        title: string;
                                        userBanStatus: Partial<{
                                            __typename?: Partial<"ChannelUserBanStatus" | undefined>;
                                            appeal?: Partial<any | null | undefined>;
                                            banned: Partial<boolean>;
                                            bannedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            description: string;
                                            moderator?: Partial<any | null | undefined>;
                                            moderatorId: string;
                                            user: Partial<any>;
                                            userId: string;
                                            violation: Partial<import("@chat-gen").ChannelViolation>;
                                        }>;
                                        viewerCount: number;
                                    } | null | undefined>;
                                    channelId: string;
                                    isOnline: Partial<boolean>;
                                    streamId: string;
                                } | null | undefined>;
                                lastStatusChange: string;
                                profile: Partial<any>;
                                userId: string;
                            }> | undefined)[];
                        }>;
                        currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        currentStreamId: string;
                        description: string;
                        features: Partial<{
                            __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                            noicePredictions: Partial<{
                                __typename?: Partial<"ChannelNoicePredictionsFeatureStatus" | undefined>;
                                enabled: Partial<boolean>;
                            }>;
                            streaming: Partial<{
                                __typename?: Partial<"ChannelStreamingFeatureStatus" | undefined>;
                                enabled: Partial<boolean>;
                                suspension?: Partial<{
                                    __typename?: Partial<"ChannelSuspension" | undefined>;
                                    description: string;
                                    moderator?: Partial<{
                                        __typename?: Partial<"ProfileProfile" | undefined>;
                                        account?: Partial<any | null | undefined>;
                                        avatarConfig?: Partial<{
                                            __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                            model: Partial<any>;
                                            modelId: string;
                                        } | null | undefined>;
                                        avatarUrl: string;
                                        avatars?: Partial<{
                                            __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                            avatar2D: string;
                                            avatar3D: string;
                                            avatarFullbody: string;
                                            avatarGender: string;
                                        } | null | undefined>;
                                        badges: (Partial<{
                                            __typename?: Partial<"BadgeBadge" | undefined>;
                                            level: number;
                                            nextLevelAt: string;
                                            type: Partial<import("@chat-gen").BadgeBadgeType>;
                                        }> | undefined)[];
                                        bio: string;
                                        channel?: Partial<{
                                            __typename?: Partial<"ChannelChannel" | undefined>;
                                            channelFriends: Partial<any>;
                                            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            currentStreamId: string;
                                            description: string;
                                            features: Partial<any>;
                                            followerCount: number;
                                            following: Partial<boolean>;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            isPublic: Partial<boolean>;
                                            itemStats: (Partial<any> | undefined)[];
                                            links: (Partial<any> | undefined)[];
                                            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                            logo: string;
                                            logoUrl: string;
                                            matureRatedContent: Partial<boolean>;
                                            name: string;
                                            offlineBanner: string;
                                            offlineBannerUrl: string;
                                            playedGameIds: (string | undefined)[];
                                            state: Partial<ApiEntityState>;
                                            streamedGames?: Partial<Partial<any>[] | null | undefined>;
                                            streamer: Partial<any>;
                                            streamerId: string;
                                            subscriberCount: number;
                                            subscription?: Partial<any | null | undefined>;
                                            subscriptionConfig?: Partial<any | null | undefined>;
                                            suspension: Partial<any>;
                                            thumbnail: string;
                                            thumbnailUrl: string;
                                            title: string;
                                            userBanStatus: Partial<any>;
                                            viewerCount: number;
                                        } | null | undefined>;
                                        discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        displayName: string;
                                        friends: (Partial<any> | undefined)[];
                                        friendshipStatus: Partial<{
                                            __typename?: Partial<"FriendsFriendshipStatus" | undefined>;
                                            activity?: Partial<any | null | undefined>;
                                            lastStatusChange: string;
                                            status: Partial<import("@chat-gen").FriendsFriendshipStatusStatus>;
                                        }>;
                                        lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                        playedGames: (Partial<{
                                            __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                            game: Partial<any>;
                                            id: string;
                                            lastPlayedAt: string;
                                            progression: Partial<any>;
                                            season: Partial<any>;
                                            seasonId: string;
                                            userId: string;
                                        }> | undefined)[];
                                        settings?: Partial<{
                                            __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                            friends: Partial<any>;
                                            privacy: Partial<any>;
                                        } | null | undefined>;
                                        state: Partial<ApiEntityState>;
                                        stats: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                            adsWatched: number;
                                            boosterUsage?: Partial<any | null | undefined>;
                                            cardBundlesPurchased: number;
                                            cardLevelUps: number;
                                            cardsPlayed: number;
                                            cardsSucceeded: number;
                                            currencySpending?: Partial<any | null | undefined>;
                                            dailyGoalCardsCompleted: number;
                                            dailyGoalCardsSet: number;
                                            matchesPlayed: number;
                                            partyMatchesPlayed: number;
                                            shufflesUsed: number;
                                            soloMatchesPlayed: number;
                                            timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        }>;
                                        userId: string;
                                        userTag: string;
                                        visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                                    } | null | undefined>;
                                    reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                    suspendedAt: string;
                                    suspendedBy: string;
                                    until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                } | null | undefined>;
                            }>;
                        }>;
                        followerCount: number;
                        following: Partial<boolean>;
                        game: Partial<{
                            __typename?: Partial<"GameGame" | undefined>;
                            activeSeason: Partial<{
                                __typename?: Partial<"GameSeason" | undefined>;
                                badgeUrl: string;
                                cardBackgroundUrls: (Partial<{
                                    __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                    rarity: Partial<import("@chat-gen").RarityRarity>;
                                    url: string;
                                }> | undefined)[];
                                endTime: string;
                                game: Partial<any>;
                                gameId: string;
                                id: string;
                                name: string;
                                progression: Partial<{
                                    __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                    level: number;
                                    nextLevel: number;
                                    nextLevelThreshold: number;
                                    season: Partial<any>;
                                    seasonId: string;
                                    xpAmount: number;
                                }>;
                                progressionPauseReason: string;
                                progressionPaused: Partial<boolean>;
                                seasonBreak: Partial<boolean>;
                                seasonBreakReason: string;
                                seasonPauseReason: string;
                                seasonPaused: Partial<boolean>;
                                startTime: string;
                            }>;
                            activeSeasonId: string;
                            backdropUrl: string;
                            iconUrl: string;
                            id: string;
                            name: string;
                            noicePredictionsEnabled: Partial<boolean>;
                            progression: Partial<{
                                __typename?: Partial<"GameUserProgression" | undefined>;
                                experiencePoints: number;
                                level: number;
                                userId: string;
                            }>;
                            publicAccess: Partial<boolean>;
                        }>;
                        gameId: string;
                        id: string;
                        isPublic: Partial<boolean>;
                        itemStats: (Partial<{
                            __typename?: Partial<"ItemItemStat" | undefined>;
                            counts: (Partial<{
                                __typename?: Partial<"ItemItemCount" | undefined>;
                                count: number;
                                type: Partial<import("@chat-gen").ItemItemType>;
                            }> | undefined)[];
                            gameId: string;
                        }> | undefined)[];
                        links: (Partial<{
                            __typename?: Partial<"ChannelChannelLink" | undefined>;
                            name: string;
                            type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                            url: string;
                        }> | undefined)[];
                        liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                        logo: string;
                        logoUrl: string;
                        matureRatedContent: Partial<boolean>;
                        name: string;
                        offlineBanner: string;
                        offlineBannerUrl: string;
                        playedGameIds: (string | undefined)[];
                        state: Partial<ApiEntityState>;
                        streamedGames?: Partial<Partial<{
                            __typename?: Partial<"GameGame" | undefined>;
                            activeSeason: Partial<{
                                __typename?: Partial<"GameSeason" | undefined>;
                                badgeUrl: string;
                                cardBackgroundUrls: (Partial<{
                                    __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                    rarity: Partial<import("@chat-gen").RarityRarity>;
                                    url: string;
                                }> | undefined)[];
                                endTime: string;
                                game: Partial<any>;
                                gameId: string;
                                id: string;
                                name: string;
                                progression: Partial<{
                                    __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                    level: number;
                                    nextLevel: number;
                                    nextLevelThreshold: number;
                                    season: Partial<any>;
                                    seasonId: string;
                                    xpAmount: number;
                                }>;
                                progressionPauseReason: string;
                                progressionPaused: Partial<boolean>;
                                seasonBreak: Partial<boolean>;
                                seasonBreakReason: string;
                                seasonPauseReason: string;
                                seasonPaused: Partial<boolean>;
                                startTime: string;
                            }>;
                            activeSeasonId: string;
                            backdropUrl: string;
                            iconUrl: string;
                            id: string;
                            name: string;
                            noicePredictionsEnabled: Partial<boolean>;
                            progression: Partial<{
                                __typename?: Partial<"GameUserProgression" | undefined>;
                                experiencePoints: number;
                                level: number;
                                userId: string;
                            }>;
                            publicAccess: Partial<boolean>;
                        }>[] | null | undefined>;
                        streamer: Partial<any>;
                        streamerId: string;
                        subscriberCount: number;
                        subscription?: Partial<{
                            __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                            activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            channel: Partial<any>;
                            channelId: string;
                            createdAt: string;
                            expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            id: string;
                            paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                            terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            tier: number;
                            userId: string;
                        } | null | undefined>;
                        subscriptionConfig?: Partial<{
                            __typename?: Partial<"SubscriptionChannelSubscriptionConfig" | undefined>;
                            channelId: string;
                            subscriptionsEnabled: Partial<boolean>;
                            tiers: (Partial<{
                                __typename?: Partial<"SubscriptionChannelSubscriptionTier" | undefined>;
                                description: string;
                                entitlements: (Partial<{
                                    __typename?: Partial<"SubscriptionChannelSubscriptionEntitlement" | undefined>;
                                    amount: number;
                                    item: Partial<{
                                        __typename?: Partial<"ItemItem" | undefined>;
                                        attributes: Partial<{
                                            __typename?: Partial<"AttributeAttributeMap" | undefined>;
                                            value: (Partial<any> | undefined)[];
                                        }>;
                                        bootstraps?: Partial<Partial<{
                                            __typename?: Partial<"ItemItemBootstrap" | undefined>;
                                            itemCount: number;
                                            itemId: string;
                                            revision: string;
                                        }>[] | null | undefined>;
                                        channelId: string;
                                        children?: Partial<Partial<any>[] | null | undefined>;
                                        consumable: Partial<boolean>;
                                        details?: Partial<{
                                            __typename?: Partial<"AvatarAnimation" | undefined>;
                                            category: (Partial<import("@chat-gen").AvatarAnimationCategory> | undefined)[];
                                            chatCommand: string;
                                            config: Partial<any>;
                                            enabled: Partial<boolean>;
                                            glbUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            mirroredGlbUrl: string;
                                            name: string;
                                        } | {
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        } | {
                                            __typename?: Partial<"EmojiEmoji" | undefined>;
                                            channelId: string;
                                            disabled: Partial<boolean>;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            label: string;
                                            name: string;
                                            prefabName: string;
                                        } | {
                                            __typename?: Partial<"GameLogicCard" | undefined>;
                                            activeStreamerCard?: Partial<any | null | undefined>;
                                            activeStreamerCards: (Partial<any> | undefined)[];
                                            availableStreamerCards: (Partial<any> | undefined)[];
                                            backImage: string;
                                            dealingModules: (string | undefined)[];
                                            description: string;
                                            failureModules: (string | undefined)[];
                                            failureTargetValue: number;
                                            familyId: string;
                                            frontImage: string;
                                            gameModes: (string | undefined)[];
                                            icon: string;
                                            id: string;
                                            isAllOrNothing: Partial<boolean>;
                                            isDealtAtStart: Partial<boolean>;
                                            isEnabled: Partial<boolean>;
                                            isMatchCard: Partial<boolean>;
                                            leveling: Partial<any>;
                                            matchCardId: number;
                                            name: string;
                                            pointsMax: number;
                                            pointsMin: number;
                                            pointsTimeTarget: number;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            roleCharacters: (string | undefined)[];
                                            scoredCounterIds: (string | undefined)[];
                                            season: Partial<any>;
                                            seasonId: string;
                                            sides: (string | undefined)[];
                                            successModules: (string | undefined)[];
                                            targetValue: number;
                                            timerDuration: number;
                                            unlockLevel: number;
                                        } | null | undefined>;
                                        disabled: Partial<boolean>;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        gameId: string;
                                        id: string;
                                        inventoryItem: Partial<{
                                            __typename?: Partial<"InventoryInventoryItem" | undefined>;
                                            item: Partial<any>;
                                            itemCount: number;
                                            itemId: string;
                                        }>;
                                        name: string;
                                        parentItemId: string;
                                        season?: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        } | null | undefined>;
                                        seasonId: string;
                                        type: Partial<import("@chat-gen").ItemItemType>;
                                        unlockItemId: string;
                                    }>;
                                    itemId: string;
                                }> | undefined)[];
                                level: number;
                                name: string;
                                prices: (Partial<{
                                    __typename?: Partial<"SubscriptionSubscriptionPrice" | undefined>;
                                    period: Partial<import("@chat-gen").SubscriptionSubscriptionPricePeriod>;
                                    price: number;
                                }> | undefined)[];
                            }> | undefined)[];
                        } | null | undefined>;
                        suspension: Partial<{
                            __typename?: Partial<"ChannelSuspension" | undefined>;
                            description: string;
                            moderator?: Partial<{
                                __typename?: Partial<"ProfileProfile" | undefined>;
                                account?: Partial<any | null | undefined>;
                                avatarConfig?: Partial<{
                                    __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                    model: Partial<{
                                        __typename?: Partial<"AvatarAvatar" | undefined>;
                                        avatar3D: string;
                                        avatarComposition: Partial<{
                                            __typename?: Partial<"AvatarAvatarComposition" | undefined>;
                                            generatorVersion: string;
                                            partCustomizations: (Partial<any> | undefined)[];
                                            partIds: (string | undefined)[];
                                        }>;
                                        avatarLods: (string | undefined)[];
                                        body: string;
                                        face: string;
                                        gender: string;
                                        id: string;
                                        selectable: Partial<boolean>;
                                    }>;
                                    modelId: string;
                                } | null | undefined>;
                                avatarUrl: string;
                                avatars?: Partial<{
                                    __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                    avatar2D: string;
                                    avatar3D: string;
                                    avatarFullbody: string;
                                    avatarGender: string;
                                } | null | undefined>;
                                badges: (Partial<{
                                    __typename?: Partial<"BadgeBadge" | undefined>;
                                    level: number;
                                    nextLevelAt: string;
                                    type: Partial<import("@chat-gen").BadgeBadgeType>;
                                }> | undefined)[];
                                bio: string;
                                channel?: Partial<{
                                    __typename?: Partial<"ChannelChannel" | undefined>;
                                    channelFriends: Partial<{
                                        __typename?: Partial<"FriendsChannelFriends" | undefined>;
                                        channelId: string;
                                        totalCount: number;
                                        users: (Partial<{
                                            __typename?: Partial<"FriendsUser" | undefined>;
                                            activity?: Partial<any | null | undefined>;
                                            lastStatusChange: string;
                                            profile: Partial<any>;
                                            userId: string;
                                        }> | undefined)[];
                                    }>;
                                    currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    currentStreamId: string;
                                    description: string;
                                    features: Partial<{
                                        __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                                        noicePredictions: Partial<{
                                            __typename?: Partial<"ChannelNoicePredictionsFeatureStatus" | undefined>;
                                            enabled: Partial<boolean>;
                                        }>;
                                        streaming: Partial<{
                                            __typename?: Partial<"ChannelStreamingFeatureStatus" | undefined>;
                                            enabled: Partial<boolean>;
                                            suspension?: Partial<any | null | undefined>;
                                        }>;
                                    }>;
                                    followerCount: number;
                                    following: Partial<boolean>;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    isPublic: Partial<boolean>;
                                    itemStats: (Partial<{
                                        __typename?: Partial<"ItemItemStat" | undefined>;
                                        counts: (Partial<{
                                            __typename?: Partial<"ItemItemCount" | undefined>;
                                            count: number;
                                            type: Partial<import("@chat-gen").ItemItemType>;
                                        }> | undefined)[];
                                        gameId: string;
                                    }> | undefined)[];
                                    links: (Partial<{
                                        __typename?: Partial<"ChannelChannelLink" | undefined>;
                                        name: string;
                                        type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                                        url: string;
                                    }> | undefined)[];
                                    liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                    logo: string;
                                    logoUrl: string;
                                    matureRatedContent: Partial<boolean>;
                                    name: string;
                                    offlineBanner: string;
                                    offlineBannerUrl: string;
                                    playedGameIds: (string | undefined)[];
                                    state: Partial<ApiEntityState>;
                                    streamedGames?: Partial<Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>[] | null | undefined>;
                                    streamer: Partial<any>;
                                    streamerId: string;
                                    subscriberCount: number;
                                    subscription?: Partial<{
                                        __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                                        activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        channel: Partial<any>;
                                        channelId: string;
                                        createdAt: string;
                                        expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        id: string;
                                        paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                                        terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        tier: number;
                                        userId: string;
                                    } | null | undefined>;
                                    subscriptionConfig?: Partial<{
                                        __typename?: Partial<"SubscriptionChannelSubscriptionConfig" | undefined>;
                                        channelId: string;
                                        subscriptionsEnabled: Partial<boolean>;
                                        tiers: (Partial<{
                                            __typename?: Partial<"SubscriptionChannelSubscriptionTier" | undefined>;
                                            description: string;
                                            entitlements: (Partial<any> | undefined)[];
                                            level: number;
                                            name: string;
                                            prices: (Partial<any> | undefined)[];
                                        }> | undefined)[];
                                    } | null | undefined>;
                                    suspension: Partial<any>;
                                    thumbnail: string;
                                    thumbnailUrl: string;
                                    title: string;
                                    userBanStatus: Partial<{
                                        __typename?: Partial<"ChannelUserBanStatus" | undefined>;
                                        appeal?: Partial<{
                                            __typename?: Partial<"ChannelBanAppealInfo" | undefined>;
                                            appealText: string;
                                            createdAt: string;
                                            reviewer: Partial<any>;
                                            reviewerComment: string;
                                            reviewerId: string;
                                            status: Partial<import("@chat-gen").ChannelAppealStatus>;
                                        } | null | undefined>;
                                        banned: Partial<boolean>;
                                        bannedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        channel: Partial<any>;
                                        channelId: string;
                                        description: string;
                                        moderator?: Partial<any | null | undefined>;
                                        moderatorId: string;
                                        user: Partial<any>;
                                        userId: string;
                                        violation: Partial<import("@chat-gen").ChannelViolation>;
                                    }>;
                                    viewerCount: number;
                                } | null | undefined>;
                                discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                displayName: string;
                                friends: (Partial<any> | undefined)[];
                                friendshipStatus: Partial<{
                                    __typename?: Partial<"FriendsFriendshipStatus" | undefined>;
                                    activity?: Partial<{
                                        __typename?: Partial<"FriendsActivity" | undefined>;
                                        channel?: Partial<{
                                            __typename?: Partial<"ChannelChannel" | undefined>;
                                            channelFriends: Partial<any>;
                                            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            currentStreamId: string;
                                            description: string;
                                            features: Partial<any>;
                                            followerCount: number;
                                            following: Partial<boolean>;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            isPublic: Partial<boolean>;
                                            itemStats: (Partial<any> | undefined)[];
                                            links: (Partial<any> | undefined)[];
                                            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                            logo: string;
                                            logoUrl: string;
                                            matureRatedContent: Partial<boolean>;
                                            name: string;
                                            offlineBanner: string;
                                            offlineBannerUrl: string;
                                            playedGameIds: (string | undefined)[];
                                            state: Partial<ApiEntityState>;
                                            streamedGames?: Partial<Partial<any>[] | null | undefined>;
                                            streamer: Partial<any>;
                                            streamerId: string;
                                            subscriberCount: number;
                                            subscription?: Partial<any | null | undefined>;
                                            subscriptionConfig?: Partial<any | null | undefined>;
                                            suspension: Partial<any>;
                                            thumbnail: string;
                                            thumbnailUrl: string;
                                            title: string;
                                            userBanStatus: Partial<any>;
                                            viewerCount: number;
                                        } | null | undefined>;
                                        channelId: string;
                                        isOnline: Partial<boolean>;
                                        streamId: string;
                                    } | null | undefined>;
                                    lastStatusChange: string;
                                    status: Partial<import("@chat-gen").FriendsFriendshipStatusStatus>;
                                }>;
                                lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                playedGames: (Partial<{
                                    __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    id: string;
                                    lastPlayedAt: string;
                                    progression: Partial<{
                                        __typename?: Partial<"GameUserProgression" | undefined>;
                                        experiencePoints: number;
                                        level: number;
                                        userId: string;
                                    }>;
                                    season: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    }>;
                                    seasonId: string;
                                    userId: string;
                                }> | undefined)[];
                                settings?: Partial<{
                                    __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                    friends: Partial<{
                                        __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                        disableFriendRequests: Partial<boolean>;
                                    }>;
                                    privacy: Partial<{
                                        __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                        anonymisePurchaseHighlights: Partial<boolean>;
                                        discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                        hideOnlineStatus: Partial<boolean>;
                                        showMatureContentWarning: Partial<boolean>;
                                        visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                    }>;
                                } | null | undefined>;
                                state: Partial<ApiEntityState>;
                                stats: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                    adsWatched: number;
                                    boosterUsage?: Partial<{
                                        __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                        doubt: number;
                                        goodCall: number;
                                        letsGo: number;
                                        nextUp: number;
                                        scavenge: number;
                                        speedUp: number;
                                        total: number;
                                    } | null | undefined>;
                                    cardBundlesPurchased: number;
                                    cardLevelUps: number;
                                    cardsPlayed: number;
                                    cardsSucceeded: number;
                                    currencySpending?: Partial<{
                                        __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                        channelCurrency: number;
                                        hardCurrency: number;
                                        softCurrency: number;
                                    } | null | undefined>;
                                    dailyGoalCardsCompleted: number;
                                    dailyGoalCardsSet: number;
                                    matchesPlayed: number;
                                    partyMatchesPlayed: number;
                                    shufflesUsed: number;
                                    soloMatchesPlayed: number;
                                    timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                }>;
                                userId: string;
                                userTag: string;
                                visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                            } | null | undefined>;
                            reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                            suspendedAt: string;
                            suspendedBy: string;
                            until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        }>;
                        thumbnail: string;
                        thumbnailUrl: string;
                        title: string;
                        userBanStatus: Partial<{
                            __typename?: Partial<"ChannelUserBanStatus" | undefined>;
                            appeal?: Partial<{
                                __typename?: Partial<"ChannelBanAppealInfo" | undefined>;
                                appealText: string;
                                createdAt: string;
                                reviewer: Partial<any>;
                                reviewerComment: string;
                                reviewerId: string;
                                status: Partial<import("@chat-gen").ChannelAppealStatus>;
                            } | null | undefined>;
                            banned: Partial<boolean>;
                            bannedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            channel: Partial<any>;
                            channelId: string;
                            description: string;
                            moderator?: Partial<{
                                __typename?: Partial<"ProfileProfile" | undefined>;
                                account?: Partial<any | null | undefined>;
                                avatarConfig?: Partial<{
                                    __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                    model: Partial<{
                                        __typename?: Partial<"AvatarAvatar" | undefined>;
                                        avatar3D: string;
                                        avatarComposition: Partial<{
                                            __typename?: Partial<"AvatarAvatarComposition" | undefined>;
                                            generatorVersion: string;
                                            partCustomizations: (Partial<any> | undefined)[];
                                            partIds: (string | undefined)[];
                                        }>;
                                        avatarLods: (string | undefined)[];
                                        body: string;
                                        face: string;
                                        gender: string;
                                        id: string;
                                        selectable: Partial<boolean>;
                                    }>;
                                    modelId: string;
                                } | null | undefined>;
                                avatarUrl: string;
                                avatars?: Partial<{
                                    __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                    avatar2D: string;
                                    avatar3D: string;
                                    avatarFullbody: string;
                                    avatarGender: string;
                                } | null | undefined>;
                                badges: (Partial<{
                                    __typename?: Partial<"BadgeBadge" | undefined>;
                                    level: number;
                                    nextLevelAt: string;
                                    type: Partial<import("@chat-gen").BadgeBadgeType>;
                                }> | undefined)[];
                                bio: string;
                                channel?: Partial<{
                                    __typename?: Partial<"ChannelChannel" | undefined>;
                                    channelFriends: Partial<{
                                        __typename?: Partial<"FriendsChannelFriends" | undefined>;
                                        channelId: string;
                                        totalCount: number;
                                        users: (Partial<{
                                            __typename?: Partial<"FriendsUser" | undefined>;
                                            activity?: Partial<any | null | undefined>;
                                            lastStatusChange: string;
                                            profile: Partial<any>;
                                            userId: string;
                                        }> | undefined)[];
                                    }>;
                                    currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    currentStreamId: string;
                                    description: string;
                                    features: Partial<{
                                        __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                                        noicePredictions: Partial<{
                                            __typename?: Partial<"ChannelNoicePredictionsFeatureStatus" | undefined>;
                                            enabled: Partial<boolean>;
                                        }>;
                                        streaming: Partial<{
                                            __typename?: Partial<"ChannelStreamingFeatureStatus" | undefined>;
                                            enabled: Partial<boolean>;
                                            suspension?: Partial<any | null | undefined>;
                                        }>;
                                    }>;
                                    followerCount: number;
                                    following: Partial<boolean>;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    isPublic: Partial<boolean>;
                                    itemStats: (Partial<{
                                        __typename?: Partial<"ItemItemStat" | undefined>;
                                        counts: (Partial<{
                                            __typename?: Partial<"ItemItemCount" | undefined>;
                                            count: number;
                                            type: Partial<import("@chat-gen").ItemItemType>;
                                        }> | undefined)[];
                                        gameId: string;
                                    }> | undefined)[];
                                    links: (Partial<{
                                        __typename?: Partial<"ChannelChannelLink" | undefined>;
                                        name: string;
                                        type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                                        url: string;
                                    }> | undefined)[];
                                    liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                    logo: string;
                                    logoUrl: string;
                                    matureRatedContent: Partial<boolean>;
                                    name: string;
                                    offlineBanner: string;
                                    offlineBannerUrl: string;
                                    playedGameIds: (string | undefined)[];
                                    state: Partial<ApiEntityState>;
                                    streamedGames?: Partial<Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>[] | null | undefined>;
                                    streamer: Partial<any>;
                                    streamerId: string;
                                    subscriberCount: number;
                                    subscription?: Partial<{
                                        __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                                        activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        channel: Partial<any>;
                                        channelId: string;
                                        createdAt: string;
                                        expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        id: string;
                                        paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                                        terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        tier: number;
                                        userId: string;
                                    } | null | undefined>;
                                    subscriptionConfig?: Partial<{
                                        __typename?: Partial<"SubscriptionChannelSubscriptionConfig" | undefined>;
                                        channelId: string;
                                        subscriptionsEnabled: Partial<boolean>;
                                        tiers: (Partial<{
                                            __typename?: Partial<"SubscriptionChannelSubscriptionTier" | undefined>;
                                            description: string;
                                            entitlements: (Partial<any> | undefined)[];
                                            level: number;
                                            name: string;
                                            prices: (Partial<any> | undefined)[];
                                        }> | undefined)[];
                                    } | null | undefined>;
                                    suspension: Partial<{
                                        __typename?: Partial<"ChannelSuspension" | undefined>;
                                        description: string;
                                        moderator?: Partial<any | null | undefined>;
                                        reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                        suspendedAt: string;
                                        suspendedBy: string;
                                        until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    }>;
                                    thumbnail: string;
                                    thumbnailUrl: string;
                                    title: string;
                                    userBanStatus: Partial<any>;
                                    viewerCount: number;
                                } | null | undefined>;
                                discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                displayName: string;
                                friends: (Partial<any> | undefined)[];
                                friendshipStatus: Partial<{
                                    __typename?: Partial<"FriendsFriendshipStatus" | undefined>;
                                    activity?: Partial<{
                                        __typename?: Partial<"FriendsActivity" | undefined>;
                                        channel?: Partial<{
                                            __typename?: Partial<"ChannelChannel" | undefined>;
                                            channelFriends: Partial<any>;
                                            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            currentStreamId: string;
                                            description: string;
                                            features: Partial<any>;
                                            followerCount: number;
                                            following: Partial<boolean>;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            isPublic: Partial<boolean>;
                                            itemStats: (Partial<any> | undefined)[];
                                            links: (Partial<any> | undefined)[];
                                            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                            logo: string;
                                            logoUrl: string;
                                            matureRatedContent: Partial<boolean>;
                                            name: string;
                                            offlineBanner: string;
                                            offlineBannerUrl: string;
                                            playedGameIds: (string | undefined)[];
                                            state: Partial<ApiEntityState>;
                                            streamedGames?: Partial<Partial<any>[] | null | undefined>;
                                            streamer: Partial<any>;
                                            streamerId: string;
                                            subscriberCount: number;
                                            subscription?: Partial<any | null | undefined>;
                                            subscriptionConfig?: Partial<any | null | undefined>;
                                            suspension: Partial<any>;
                                            thumbnail: string;
                                            thumbnailUrl: string;
                                            title: string;
                                            userBanStatus: Partial<any>;
                                            viewerCount: number;
                                        } | null | undefined>;
                                        channelId: string;
                                        isOnline: Partial<boolean>;
                                        streamId: string;
                                    } | null | undefined>;
                                    lastStatusChange: string;
                                    status: Partial<import("@chat-gen").FriendsFriendshipStatusStatus>;
                                }>;
                                lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                playedGames: (Partial<{
                                    __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    id: string;
                                    lastPlayedAt: string;
                                    progression: Partial<{
                                        __typename?: Partial<"GameUserProgression" | undefined>;
                                        experiencePoints: number;
                                        level: number;
                                        userId: string;
                                    }>;
                                    season: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    }>;
                                    seasonId: string;
                                    userId: string;
                                }> | undefined)[];
                                settings?: Partial<{
                                    __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                    friends: Partial<{
                                        __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                        disableFriendRequests: Partial<boolean>;
                                    }>;
                                    privacy: Partial<{
                                        __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                        anonymisePurchaseHighlights: Partial<boolean>;
                                        discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                        hideOnlineStatus: Partial<boolean>;
                                        showMatureContentWarning: Partial<boolean>;
                                        visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                    }>;
                                } | null | undefined>;
                                state: Partial<ApiEntityState>;
                                stats: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                    adsWatched: number;
                                    boosterUsage?: Partial<{
                                        __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                        doubt: number;
                                        goodCall: number;
                                        letsGo: number;
                                        nextUp: number;
                                        scavenge: number;
                                        speedUp: number;
                                        total: number;
                                    } | null | undefined>;
                                    cardBundlesPurchased: number;
                                    cardLevelUps: number;
                                    cardsPlayed: number;
                                    cardsSucceeded: number;
                                    currencySpending?: Partial<{
                                        __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                        channelCurrency: number;
                                        hardCurrency: number;
                                        softCurrency: number;
                                    } | null | undefined>;
                                    dailyGoalCardsCompleted: number;
                                    dailyGoalCardsSet: number;
                                    matchesPlayed: number;
                                    partyMatchesPlayed: number;
                                    shufflesUsed: number;
                                    soloMatchesPlayed: number;
                                    timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                }>;
                                userId: string;
                                userTag: string;
                                visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                            } | null | undefined>;
                            moderatorId: string;
                            user: Partial<any>;
                            userId: string;
                            violation: Partial<import("@chat-gen").ChannelViolation>;
                        }>;
                        viewerCount: number;
                    }>;
                    channelId: string;
                } | {
                    __typename?: Partial<"AuthSignupOriginPage" | undefined>;
                    url: string;
                } | null | undefined>;
            } | null | undefined>;
            state: Partial<ApiEntityState>;
            uid: string;
        } | null | undefined>;
        avatarConfig?: Partial<{
            __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
            model: Partial<{
                __typename?: Partial<"AvatarAvatar" | undefined>;
                avatar3D: string;
                avatarComposition: Partial<{
                    __typename?: Partial<"AvatarAvatarComposition" | undefined>;
                    generatorVersion: string;
                    partCustomizations: (Partial<{
                        __typename?: Partial<"AvatarAvatarPartCustomization" | undefined>;
                        colors: (string | undefined)[];
                        lutUrl: string;
                        partId: string;
                    }> | undefined)[];
                    partIds: (string | undefined)[];
                }>;
                avatarLods: (string | undefined)[];
                body: string;
                face: string;
                gender: string;
                id: string;
                selectable: Partial<boolean>;
            }>;
            modelId: string;
        } | null | undefined>;
        avatarUrl: string;
        avatars?: Partial<{
            __typename?: Partial<"ProfileProfileAvatars" | undefined>;
            avatar2D: string;
            avatar3D: string;
            avatarFullbody: string;
            avatarGender: string;
        } | null | undefined>;
        badges: (Partial<{
            __typename?: Partial<"BadgeBadge" | undefined>;
            level: number;
            nextLevelAt: string;
            type: Partial<import("@chat-gen").BadgeBadgeType>;
        }> | undefined)[];
        bio: string;
        channel?: Partial<{
            __typename?: Partial<"ChannelChannel" | undefined>;
            channelFriends: Partial<{
                __typename?: Partial<"FriendsChannelFriends" | undefined>;
                channelId: string;
                totalCount: number;
                users: (Partial<{
                    __typename?: Partial<"FriendsUser" | undefined>;
                    activity?: Partial<{
                        __typename?: Partial<"FriendsActivity" | undefined>;
                        channel?: Partial<any | null | undefined>;
                        channelId: string;
                        isOnline: Partial<boolean>;
                        streamId: string;
                    } | null | undefined>;
                    lastStatusChange: string;
                    profile: Partial<any>;
                    userId: string;
                }> | undefined)[];
            }>;
            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
            currentStreamId: string;
            description: string;
            features: Partial<{
                __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                noicePredictions: Partial<{
                    __typename?: Partial<"ChannelNoicePredictionsFeatureStatus" | undefined>;
                    enabled: Partial<boolean>;
                }>;
                streaming: Partial<{
                    __typename?: Partial<"ChannelStreamingFeatureStatus" | undefined>;
                    enabled: Partial<boolean>;
                    suspension?: Partial<{
                        __typename?: Partial<"ChannelSuspension" | undefined>;
                        description: string;
                        moderator?: Partial<{
                            __typename?: Partial<"ProfileProfile" | undefined>;
                            account?: Partial<{
                                __typename?: Partial<"AuthAccount" | undefined>;
                                acceptedTerms: (Partial<{
                                    __typename?: Partial<"AuthTermsVersion" | undefined>;
                                    name: string;
                                    revision: string;
                                    signature: string;
                                }> | undefined)[];
                                birthday?: Partial<{
                                    __typename?: Partial<"AuthDate" | undefined>;
                                    day: number;
                                    month: number;
                                    year: number;
                                } | null | undefined>;
                                createdAt: string;
                                email: string;
                                emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                externalIds: (Partial<{
                                    __typename?: Partial<"AuthIdentity" | undefined>;
                                    id: string;
                                    type: Partial<import("@chat-gen").AuthIdentityType>;
                                }> | undefined)[];
                                flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                                isBot: Partial<boolean>;
                                marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                                matureRatedContentAllowed: Partial<boolean>;
                                pendingAgreements: (Partial<{
                                    __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                                    name: string;
                                    revision: string;
                                    url: string;
                                }> | undefined)[];
                                roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                                signupOrigin?: Partial<{
                                    __typename?: Partial<"AuthSignupOrigin" | undefined>;
                                    origin?: Partial<{
                                        __typename?: Partial<"AuthSignupOriginCampaign" | undefined>;
                                        campaign: string;
                                        content: string;
                                        creator: string;
                                        format: string;
                                        medium: string;
                                        source: string;
                                        term: string;
                                    } | {
                                        __typename?: Partial<"AuthSignupOriginChannel" | undefined>;
                                        channel: Partial<{
                                            __typename?: Partial<"ChannelChannel" | undefined>;
                                            channelFriends: Partial<any>;
                                            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            currentStreamId: string;
                                            description: string;
                                            features: Partial<any>;
                                            followerCount: number;
                                            following: Partial<boolean>;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            isPublic: Partial<boolean>;
                                            itemStats: (Partial<any> | undefined)[];
                                            links: (Partial<any> | undefined)[];
                                            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                            logo: string;
                                            logoUrl: string;
                                            matureRatedContent: Partial<boolean>;
                                            name: string;
                                            offlineBanner: string;
                                            offlineBannerUrl: string;
                                            playedGameIds: (string | undefined)[];
                                            state: Partial<ApiEntityState>;
                                            streamedGames?: Partial<Partial<any>[] | null | undefined>;
                                            streamer: Partial<any>;
                                            streamerId: string;
                                            subscriberCount: number;
                                            subscription?: Partial<any | null | undefined>;
                                            subscriptionConfig?: Partial<any | null | undefined>;
                                            suspension: Partial<any>;
                                            thumbnail: string;
                                            thumbnailUrl: string;
                                            title: string;
                                            userBanStatus: Partial<any>;
                                            viewerCount: number;
                                        }>;
                                        channelId: string;
                                    } | {
                                        __typename?: Partial<"AuthSignupOriginPage" | undefined>;
                                        url: string;
                                    } | null | undefined>;
                                } | null | undefined>;
                                state: Partial<ApiEntityState>;
                                uid: string;
                            } | null | undefined>;
                            avatarConfig?: Partial<{
                                __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                model: Partial<{
                                    __typename?: Partial<"AvatarAvatar" | undefined>;
                                    avatar3D: string;
                                    avatarComposition: Partial<{
                                        __typename?: Partial<"AvatarAvatarComposition" | undefined>;
                                        generatorVersion: string;
                                        partCustomizations: (Partial<{
                                            __typename?: Partial<"AvatarAvatarPartCustomization" | undefined>;
                                            colors: (string | undefined)[];
                                            lutUrl: string;
                                            partId: string;
                                        }> | undefined)[];
                                        partIds: (string | undefined)[];
                                    }>;
                                    avatarLods: (string | undefined)[];
                                    body: string;
                                    face: string;
                                    gender: string;
                                    id: string;
                                    selectable: Partial<boolean>;
                                }>;
                                modelId: string;
                            } | null | undefined>;
                            avatarUrl: string;
                            avatars?: Partial<{
                                __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                avatar2D: string;
                                avatar3D: string;
                                avatarFullbody: string;
                                avatarGender: string;
                            } | null | undefined>;
                            badges: (Partial<{
                                __typename?: Partial<"BadgeBadge" | undefined>;
                                level: number;
                                nextLevelAt: string;
                                type: Partial<import("@chat-gen").BadgeBadgeType>;
                            }> | undefined)[];
                            bio: string;
                            channel?: Partial<any | null | undefined>;
                            discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            displayName: string;
                            friends: (Partial<any> | undefined)[];
                            friendshipStatus: Partial<{
                                __typename?: Partial<"FriendsFriendshipStatus" | undefined>;
                                activity?: Partial<{
                                    __typename?: Partial<"FriendsActivity" | undefined>;
                                    channel?: Partial<any | null | undefined>;
                                    channelId: string;
                                    isOnline: Partial<boolean>;
                                    streamId: string;
                                } | null | undefined>;
                                lastStatusChange: string;
                                status: Partial<import("@chat-gen").FriendsFriendshipStatusStatus>;
                            }>;
                            lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                            playedGames: (Partial<{
                                __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                game: Partial<{
                                    __typename?: Partial<"GameGame" | undefined>;
                                    activeSeason: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<any>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    }>;
                                    activeSeasonId: string;
                                    backdropUrl: string;
                                    iconUrl: string;
                                    id: string;
                                    name: string;
                                    noicePredictionsEnabled: Partial<boolean>;
                                    progression: Partial<{
                                        __typename?: Partial<"GameUserProgression" | undefined>;
                                        experiencePoints: number;
                                        level: number;
                                        userId: string;
                                    }>;
                                    publicAccess: Partial<boolean>;
                                }>;
                                id: string;
                                lastPlayedAt: string;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                season: Partial<{
                                    __typename?: Partial<"GameSeason" | undefined>;
                                    badgeUrl: string;
                                    cardBackgroundUrls: (Partial<{
                                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        url: string;
                                    }> | undefined)[];
                                    endTime: string;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<any>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    name: string;
                                    progression: Partial<{
                                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                        level: number;
                                        nextLevel: number;
                                        nextLevelThreshold: number;
                                        season: Partial<any>;
                                        seasonId: string;
                                        xpAmount: number;
                                    }>;
                                    progressionPauseReason: string;
                                    progressionPaused: Partial<boolean>;
                                    seasonBreak: Partial<boolean>;
                                    seasonBreakReason: string;
                                    seasonPauseReason: string;
                                    seasonPaused: Partial<boolean>;
                                    startTime: string;
                                }>;
                                seasonId: string;
                                userId: string;
                            }> | undefined)[];
                            settings?: Partial<{
                                __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                friends: Partial<{
                                    __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                    disableFriendRequests: Partial<boolean>;
                                }>;
                                privacy: Partial<{
                                    __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                    anonymisePurchaseHighlights: Partial<boolean>;
                                    discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                    hideOnlineStatus: Partial<boolean>;
                                    showMatureContentWarning: Partial<boolean>;
                                    visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                }>;
                            } | null | undefined>;
                            state: Partial<ApiEntityState>;
                            stats: Partial<{
                                __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                adsWatched: number;
                                boosterUsage?: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                    doubt: number;
                                    goodCall: number;
                                    letsGo: number;
                                    nextUp: number;
                                    scavenge: number;
                                    speedUp: number;
                                    total: number;
                                } | null | undefined>;
                                cardBundlesPurchased: number;
                                cardLevelUps: number;
                                cardsPlayed: number;
                                cardsSucceeded: number;
                                currencySpending?: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                    channelCurrency: number;
                                    hardCurrency: number;
                                    softCurrency: number;
                                } | null | undefined>;
                                dailyGoalCardsCompleted: number;
                                dailyGoalCardsSet: number;
                                matchesPlayed: number;
                                partyMatchesPlayed: number;
                                shufflesUsed: number;
                                soloMatchesPlayed: number;
                                timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            }>;
                            userId: string;
                            userTag: string;
                            visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                        } | null | undefined>;
                        reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                        suspendedAt: string;
                        suspendedBy: string;
                        until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    } | null | undefined>;
                }>;
            }>;
            followerCount: number;
            following: Partial<boolean>;
            game: Partial<{
                __typename?: Partial<"GameGame" | undefined>;
                activeSeason: Partial<{
                    __typename?: Partial<"GameSeason" | undefined>;
                    badgeUrl: string;
                    cardBackgroundUrls: (Partial<{
                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                        rarity: Partial<import("@chat-gen").RarityRarity>;
                        url: string;
                    }> | undefined)[];
                    endTime: string;
                    game: Partial<any>;
                    gameId: string;
                    id: string;
                    name: string;
                    progression: Partial<{
                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                        level: number;
                        nextLevel: number;
                        nextLevelThreshold: number;
                        season: Partial<any>;
                        seasonId: string;
                        xpAmount: number;
                    }>;
                    progressionPauseReason: string;
                    progressionPaused: Partial<boolean>;
                    seasonBreak: Partial<boolean>;
                    seasonBreakReason: string;
                    seasonPauseReason: string;
                    seasonPaused: Partial<boolean>;
                    startTime: string;
                }>;
                activeSeasonId: string;
                backdropUrl: string;
                iconUrl: string;
                id: string;
                name: string;
                noicePredictionsEnabled: Partial<boolean>;
                progression: Partial<{
                    __typename?: Partial<"GameUserProgression" | undefined>;
                    experiencePoints: number;
                    level: number;
                    userId: string;
                }>;
                publicAccess: Partial<boolean>;
            }>;
            gameId: string;
            id: string;
            isPublic: Partial<boolean>;
            itemStats: (Partial<{
                __typename?: Partial<"ItemItemStat" | undefined>;
                counts: (Partial<{
                    __typename?: Partial<"ItemItemCount" | undefined>;
                    count: number;
                    type: Partial<import("@chat-gen").ItemItemType>;
                }> | undefined)[];
                gameId: string;
            }> | undefined)[];
            links: (Partial<{
                __typename?: Partial<"ChannelChannelLink" | undefined>;
                name: string;
                type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                url: string;
            }> | undefined)[];
            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
            logo: string;
            logoUrl: string;
            matureRatedContent: Partial<boolean>;
            name: string;
            offlineBanner: string;
            offlineBannerUrl: string;
            playedGameIds: (string | undefined)[];
            state: Partial<ApiEntityState>;
            streamedGames?: Partial<Partial<{
                __typename?: Partial<"GameGame" | undefined>;
                activeSeason: Partial<{
                    __typename?: Partial<"GameSeason" | undefined>;
                    badgeUrl: string;
                    cardBackgroundUrls: (Partial<{
                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                        rarity: Partial<import("@chat-gen").RarityRarity>;
                        url: string;
                    }> | undefined)[];
                    endTime: string;
                    game: Partial<any>;
                    gameId: string;
                    id: string;
                    name: string;
                    progression: Partial<{
                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                        level: number;
                        nextLevel: number;
                        nextLevelThreshold: number;
                        season: Partial<any>;
                        seasonId: string;
                        xpAmount: number;
                    }>;
                    progressionPauseReason: string;
                    progressionPaused: Partial<boolean>;
                    seasonBreak: Partial<boolean>;
                    seasonBreakReason: string;
                    seasonPauseReason: string;
                    seasonPaused: Partial<boolean>;
                    startTime: string;
                }>;
                activeSeasonId: string;
                backdropUrl: string;
                iconUrl: string;
                id: string;
                name: string;
                noicePredictionsEnabled: Partial<boolean>;
                progression: Partial<{
                    __typename?: Partial<"GameUserProgression" | undefined>;
                    experiencePoints: number;
                    level: number;
                    userId: string;
                }>;
                publicAccess: Partial<boolean>;
            }>[] | null | undefined>;
            streamer: Partial<any>;
            streamerId: string;
            subscriberCount: number;
            subscription?: Partial<{
                __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                channel: Partial<{
                    __typename?: Partial<"ChannelChannel" | undefined>;
                    channelFriends: Partial<{
                        __typename?: Partial<"FriendsChannelFriends" | undefined>;
                        channelId: string;
                        totalCount: number;
                        users: (Partial<{
                            __typename?: Partial<"FriendsUser" | undefined>;
                            activity?: Partial<{
                                __typename?: Partial<"FriendsActivity" | undefined>;
                                channel?: Partial<any | null | undefined>;
                                channelId: string;
                                isOnline: Partial<boolean>;
                                streamId: string;
                            } | null | undefined>;
                            lastStatusChange: string;
                            profile: Partial<any>;
                            userId: string;
                        }> | undefined)[];
                    }>;
                    currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    currentStreamId: string;
                    description: string;
                    features: Partial<{
                        __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                        noicePredictions: Partial<{
                            __typename?: Partial<"ChannelNoicePredictionsFeatureStatus" | undefined>;
                            enabled: Partial<boolean>;
                        }>;
                        streaming: Partial<{
                            __typename?: Partial<"ChannelStreamingFeatureStatus" | undefined>;
                            enabled: Partial<boolean>;
                            suspension?: Partial<{
                                __typename?: Partial<"ChannelSuspension" | undefined>;
                                description: string;
                                moderator?: Partial<{
                                    __typename?: Partial<"ProfileProfile" | undefined>;
                                    account?: Partial<{
                                        __typename?: Partial<"AuthAccount" | undefined>;
                                        acceptedTerms: (Partial<{
                                            __typename?: Partial<"AuthTermsVersion" | undefined>;
                                            name: string;
                                            revision: string;
                                            signature: string;
                                        }> | undefined)[];
                                        birthday?: Partial<{
                                            __typename?: Partial<"AuthDate" | undefined>;
                                            day: number;
                                            month: number;
                                            year: number;
                                        } | null | undefined>;
                                        createdAt: string;
                                        email: string;
                                        emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        externalIds: (Partial<{
                                            __typename?: Partial<"AuthIdentity" | undefined>;
                                            id: string;
                                            type: Partial<import("@chat-gen").AuthIdentityType>;
                                        }> | undefined)[];
                                        flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                                        isBot: Partial<boolean>;
                                        marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                                        matureRatedContentAllowed: Partial<boolean>;
                                        pendingAgreements: (Partial<{
                                            __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                                            name: string;
                                            revision: string;
                                            url: string;
                                        }> | undefined)[];
                                        roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                                        signupOrigin?: Partial<{
                                            __typename?: Partial<"AuthSignupOrigin" | undefined>;
                                            origin?: Partial<any | any | any | null | undefined>;
                                        } | null | undefined>;
                                        state: Partial<ApiEntityState>;
                                        uid: string;
                                    } | null | undefined>;
                                    avatarConfig?: Partial<{
                                        __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                        model: Partial<{
                                            __typename?: Partial<"AvatarAvatar" | undefined>;
                                            avatar3D: string;
                                            avatarComposition: Partial<any>;
                                            avatarLods: (string | undefined)[];
                                            body: string;
                                            face: string;
                                            gender: string;
                                            id: string;
                                            selectable: Partial<boolean>;
                                        }>;
                                        modelId: string;
                                    } | null | undefined>;
                                    avatarUrl: string;
                                    avatars?: Partial<{
                                        __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                        avatar2D: string;
                                        avatar3D: string;
                                        avatarFullbody: string;
                                        avatarGender: string;
                                    } | null | undefined>;
                                    badges: (Partial<{
                                        __typename?: Partial<"BadgeBadge" | undefined>;
                                        level: number;
                                        nextLevelAt: string;
                                        type: Partial<import("@chat-gen").BadgeBadgeType>;
                                    }> | undefined)[];
                                    bio: string;
                                    channel?: Partial<any | null | undefined>;
                                    discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    displayName: string;
                                    friends: (Partial<any> | undefined)[];
                                    friendshipStatus: Partial<{
                                        __typename?: Partial<"FriendsFriendshipStatus" | undefined>;
                                        activity?: Partial<{
                                            __typename?: Partial<"FriendsActivity" | undefined>;
                                            channel?: Partial<any | null | undefined>;
                                            channelId: string;
                                            isOnline: Partial<boolean>;
                                            streamId: string;
                                        } | null | undefined>;
                                        lastStatusChange: string;
                                        status: Partial<import("@chat-gen").FriendsFriendshipStatusStatus>;
                                    }>;
                                    lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                    playedGames: (Partial<{
                                        __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        id: string;
                                        lastPlayedAt: string;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        season: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        seasonId: string;
                                        userId: string;
                                    }> | undefined)[];
                                    settings?: Partial<{
                                        __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                        friends: Partial<{
                                            __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                            disableFriendRequests: Partial<boolean>;
                                        }>;
                                        privacy: Partial<{
                                            __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                            anonymisePurchaseHighlights: Partial<boolean>;
                                            discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                            hideOnlineStatus: Partial<boolean>;
                                            showMatureContentWarning: Partial<boolean>;
                                            visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                        }>;
                                    } | null | undefined>;
                                    state: Partial<ApiEntityState>;
                                    stats: Partial<{
                                        __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                        adsWatched: number;
                                        boosterUsage?: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                            doubt: number;
                                            goodCall: number;
                                            letsGo: number;
                                            nextUp: number;
                                            scavenge: number;
                                            speedUp: number;
                                            total: number;
                                        } | null | undefined>;
                                        cardBundlesPurchased: number;
                                        cardLevelUps: number;
                                        cardsPlayed: number;
                                        cardsSucceeded: number;
                                        currencySpending?: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                            channelCurrency: number;
                                            hardCurrency: number;
                                            softCurrency: number;
                                        } | null | undefined>;
                                        dailyGoalCardsCompleted: number;
                                        dailyGoalCardsSet: number;
                                        matchesPlayed: number;
                                        partyMatchesPlayed: number;
                                        shufflesUsed: number;
                                        soloMatchesPlayed: number;
                                        timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    }>;
                                    userId: string;
                                    userTag: string;
                                    visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                                } | null | undefined>;
                                reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                suspendedAt: string;
                                suspendedBy: string;
                                until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            } | null | undefined>;
                        }>;
                    }>;
                    followerCount: number;
                    following: Partial<boolean>;
                    game: Partial<{
                        __typename?: Partial<"GameGame" | undefined>;
                        activeSeason: Partial<{
                            __typename?: Partial<"GameSeason" | undefined>;
                            badgeUrl: string;
                            cardBackgroundUrls: (Partial<{
                                __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                rarity: Partial<import("@chat-gen").RarityRarity>;
                                url: string;
                            }> | undefined)[];
                            endTime: string;
                            game: Partial<any>;
                            gameId: string;
                            id: string;
                            name: string;
                            progression: Partial<{
                                __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                level: number;
                                nextLevel: number;
                                nextLevelThreshold: number;
                                season: Partial<any>;
                                seasonId: string;
                                xpAmount: number;
                            }>;
                            progressionPauseReason: string;
                            progressionPaused: Partial<boolean>;
                            seasonBreak: Partial<boolean>;
                            seasonBreakReason: string;
                            seasonPauseReason: string;
                            seasonPaused: Partial<boolean>;
                            startTime: string;
                        }>;
                        activeSeasonId: string;
                        backdropUrl: string;
                        iconUrl: string;
                        id: string;
                        name: string;
                        noicePredictionsEnabled: Partial<boolean>;
                        progression: Partial<{
                            __typename?: Partial<"GameUserProgression" | undefined>;
                            experiencePoints: number;
                            level: number;
                            userId: string;
                        }>;
                        publicAccess: Partial<boolean>;
                    }>;
                    gameId: string;
                    id: string;
                    isPublic: Partial<boolean>;
                    itemStats: (Partial<{
                        __typename?: Partial<"ItemItemStat" | undefined>;
                        counts: (Partial<{
                            __typename?: Partial<"ItemItemCount" | undefined>;
                            count: number;
                            type: Partial<import("@chat-gen").ItemItemType>;
                        }> | undefined)[];
                        gameId: string;
                    }> | undefined)[];
                    links: (Partial<{
                        __typename?: Partial<"ChannelChannelLink" | undefined>;
                        name: string;
                        type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                        url: string;
                    }> | undefined)[];
                    liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                    logo: string;
                    logoUrl: string;
                    matureRatedContent: Partial<boolean>;
                    name: string;
                    offlineBanner: string;
                    offlineBannerUrl: string;
                    playedGameIds: (string | undefined)[];
                    state: Partial<ApiEntityState>;
                    streamedGames?: Partial<Partial<{
                        __typename?: Partial<"GameGame" | undefined>;
                        activeSeason: Partial<{
                            __typename?: Partial<"GameSeason" | undefined>;
                            badgeUrl: string;
                            cardBackgroundUrls: (Partial<{
                                __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                rarity: Partial<import("@chat-gen").RarityRarity>;
                                url: string;
                            }> | undefined)[];
                            endTime: string;
                            game: Partial<any>;
                            gameId: string;
                            id: string;
                            name: string;
                            progression: Partial<{
                                __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                level: number;
                                nextLevel: number;
                                nextLevelThreshold: number;
                                season: Partial<any>;
                                seasonId: string;
                                xpAmount: number;
                            }>;
                            progressionPauseReason: string;
                            progressionPaused: Partial<boolean>;
                            seasonBreak: Partial<boolean>;
                            seasonBreakReason: string;
                            seasonPauseReason: string;
                            seasonPaused: Partial<boolean>;
                            startTime: string;
                        }>;
                        activeSeasonId: string;
                        backdropUrl: string;
                        iconUrl: string;
                        id: string;
                        name: string;
                        noicePredictionsEnabled: Partial<boolean>;
                        progression: Partial<{
                            __typename?: Partial<"GameUserProgression" | undefined>;
                            experiencePoints: number;
                            level: number;
                            userId: string;
                        }>;
                        publicAccess: Partial<boolean>;
                    }>[] | null | undefined>;
                    streamer: Partial<any>;
                    streamerId: string;
                    subscriberCount: number;
                    subscription?: Partial<any | null | undefined>;
                    subscriptionConfig?: Partial<{
                        __typename?: Partial<"SubscriptionChannelSubscriptionConfig" | undefined>;
                        channelId: string;
                        subscriptionsEnabled: Partial<boolean>;
                        tiers: (Partial<{
                            __typename?: Partial<"SubscriptionChannelSubscriptionTier" | undefined>;
                            description: string;
                            entitlements: (Partial<{
                                __typename?: Partial<"SubscriptionChannelSubscriptionEntitlement" | undefined>;
                                amount: number;
                                item: Partial<{
                                    __typename?: Partial<"ItemItem" | undefined>;
                                    attributes: Partial<{
                                        __typename?: Partial<"AttributeAttributeMap" | undefined>;
                                        value: (Partial<{
                                            __typename?: Partial<"AttributeAttributeMapValueEntry" | undefined>;
                                            key: string;
                                            value: Partial<any>;
                                        }> | undefined)[];
                                    }>;
                                    bootstraps?: Partial<Partial<{
                                        __typename?: Partial<"ItemItemBootstrap" | undefined>;
                                        itemCount: number;
                                        itemId: string;
                                        revision: string;
                                    }>[] | null | undefined>;
                                    channelId: string;
                                    children?: Partial<Partial<any>[] | null | undefined>;
                                    consumable: Partial<boolean>;
                                    details?: Partial<{
                                        __typename?: Partial<"AvatarAnimation" | undefined>;
                                        category: (Partial<import("@chat-gen").AvatarAnimationCategory> | undefined)[];
                                        chatCommand: string;
                                        config: Partial<{
                                            __typename?: Partial<"AvatarAnimationConfig" | undefined>;
                                            clamp: Partial<boolean>;
                                            fadeInTimeSec: number;
                                            handedness: Partial<import("@chat-gen").AvatarAnimationHandedness>;
                                            interruptible: Partial<boolean>;
                                            maxLoops: number;
                                            randomizeLoops: Partial<boolean>;
                                        }>;
                                        enabled: Partial<boolean>;
                                        glbUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        mirroredGlbUrl: string;
                                        name: string;
                                    } | {
                                        __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                        baseCard: Partial<{
                                            __typename?: Partial<"GameLogicCard" | undefined>;
                                            activeStreamerCard?: Partial<any | null | undefined>;
                                            activeStreamerCards: (Partial<any> | undefined)[];
                                            availableStreamerCards: (Partial<any> | undefined)[];
                                            backImage: string;
                                            dealingModules: (string | undefined)[];
                                            description: string;
                                            failureModules: (string | undefined)[];
                                            failureTargetValue: number;
                                            familyId: string;
                                            frontImage: string;
                                            gameModes: (string | undefined)[];
                                            icon: string;
                                            id: string;
                                            isAllOrNothing: Partial<boolean>;
                                            isDealtAtStart: Partial<boolean>;
                                            isEnabled: Partial<boolean>;
                                            isMatchCard: Partial<boolean>;
                                            leveling: Partial<any>;
                                            matchCardId: number;
                                            name: string;
                                            pointsMax: number;
                                            pointsMin: number;
                                            pointsTimeTarget: number;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            roleCharacters: (string | undefined)[];
                                            scoredCounterIds: (string | undefined)[];
                                            season: Partial<any>;
                                            seasonId: string;
                                            sides: (string | undefined)[];
                                            successModules: (string | undefined)[];
                                            targetValue: number;
                                            timerDuration: number;
                                            unlockLevel: number;
                                        }>;
                                        channel: Partial<any>;
                                        channelId: string;
                                        draft: Partial<boolean>;
                                        facecam: string;
                                        facecamUrl: string;
                                        familyId: string;
                                        gameId: string;
                                        id: string;
                                        image: string;
                                        imageUrl: string;
                                        name: string;
                                        saleConfig?: Partial<{
                                            __typename?: Partial<"StoreV2StreamerCardSaleConfig" | undefined>;
                                            cardId: string;
                                            channelId: string;
                                            enabled: Partial<boolean>;
                                            excludeFromBundles: Partial<boolean>;
                                            period?: Partial<any | null | undefined>;
                                        } | null | undefined>;
                                        video: string;
                                        videoUrl: string;
                                    } | {
                                        __typename?: Partial<"EmojiEmoji" | undefined>;
                                        channelId: string;
                                        disabled: Partial<boolean>;
                                        id: string;
                                        image: string;
                                        imageUrl: string;
                                        label: string;
                                        name: string;
                                        prefabName: string;
                                    } | {
                                        __typename?: Partial<"GameLogicCard" | undefined>;
                                        activeStreamerCard?: Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        } | null | undefined>;
                                        activeStreamerCards: (Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        }> | undefined)[];
                                        availableStreamerCards: (Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        }> | undefined)[];
                                        backImage: string;
                                        dealingModules: (string | undefined)[];
                                        description: string;
                                        failureModules: (string | undefined)[];
                                        failureTargetValue: number;
                                        familyId: string;
                                        frontImage: string;
                                        gameModes: (string | undefined)[];
                                        icon: string;
                                        id: string;
                                        isAllOrNothing: Partial<boolean>;
                                        isDealtAtStart: Partial<boolean>;
                                        isEnabled: Partial<boolean>;
                                        isMatchCard: Partial<boolean>;
                                        leveling: Partial<{
                                            __typename?: Partial<"GameLogicCardLeveling" | undefined>;
                                            currentLevel: number;
                                            nextLevelLimit: number;
                                            progressToNextLevel: number;
                                        }>;
                                        matchCardId: number;
                                        name: string;
                                        pointsMax: number;
                                        pointsMin: number;
                                        pointsTimeTarget: number;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        roleCharacters: (string | undefined)[];
                                        scoredCounterIds: (string | undefined)[];
                                        season: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        seasonId: string;
                                        sides: (string | undefined)[];
                                        successModules: (string | undefined)[];
                                        targetValue: number;
                                        timerDuration: number;
                                        unlockLevel: number;
                                    } | null | undefined>;
                                    disabled: Partial<boolean>;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    inventoryItem: Partial<{
                                        __typename?: Partial<"InventoryInventoryItem" | undefined>;
                                        item: Partial<any>;
                                        itemCount: number;
                                        itemId: string;
                                    }>;
                                    name: string;
                                    parentItemId: string;
                                    season?: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    } | null | undefined>;
                                    seasonId: string;
                                    type: Partial<import("@chat-gen").ItemItemType>;
                                    unlockItemId: string;
                                }>;
                                itemId: string;
                            }> | undefined)[];
                            level: number;
                            name: string;
                            prices: (Partial<{
                                __typename?: Partial<"SubscriptionSubscriptionPrice" | undefined>;
                                period: Partial<import("@chat-gen").SubscriptionSubscriptionPricePeriod>;
                                price: number;
                            }> | undefined)[];
                        }> | undefined)[];
                    } | null | undefined>;
                    suspension: Partial<{
                        __typename?: Partial<"ChannelSuspension" | undefined>;
                        description: string;
                        moderator?: Partial<{
                            __typename?: Partial<"ProfileProfile" | undefined>;
                            account?: Partial<{
                                __typename?: Partial<"AuthAccount" | undefined>;
                                acceptedTerms: (Partial<{
                                    __typename?: Partial<"AuthTermsVersion" | undefined>;
                                    name: string;
                                    revision: string;
                                    signature: string;
                                }> | undefined)[];
                                birthday?: Partial<{
                                    __typename?: Partial<"AuthDate" | undefined>;
                                    day: number;
                                    month: number;
                                    year: number;
                                } | null | undefined>;
                                createdAt: string;
                                email: string;
                                emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                externalIds: (Partial<{
                                    __typename?: Partial<"AuthIdentity" | undefined>;
                                    id: string;
                                    type: Partial<import("@chat-gen").AuthIdentityType>;
                                }> | undefined)[];
                                flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                                isBot: Partial<boolean>;
                                marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                                matureRatedContentAllowed: Partial<boolean>;
                                pendingAgreements: (Partial<{
                                    __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                                    name: string;
                                    revision: string;
                                    url: string;
                                }> | undefined)[];
                                roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                                signupOrigin?: Partial<{
                                    __typename?: Partial<"AuthSignupOrigin" | undefined>;
                                    origin?: Partial<{
                                        __typename?: Partial<"AuthSignupOriginCampaign" | undefined>;
                                        campaign: string;
                                        content: string;
                                        creator: string;
                                        format: string;
                                        medium: string;
                                        source: string;
                                        term: string;
                                    } | {
                                        __typename?: Partial<"AuthSignupOriginChannel" | undefined>;
                                        channel: Partial<any>;
                                        channelId: string;
                                    } | {
                                        __typename?: Partial<"AuthSignupOriginPage" | undefined>;
                                        url: string;
                                    } | null | undefined>;
                                } | null | undefined>;
                                state: Partial<ApiEntityState>;
                                uid: string;
                            } | null | undefined>;
                            avatarConfig?: Partial<{
                                __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                model: Partial<{
                                    __typename?: Partial<"AvatarAvatar" | undefined>;
                                    avatar3D: string;
                                    avatarComposition: Partial<{
                                        __typename?: Partial<"AvatarAvatarComposition" | undefined>;
                                        generatorVersion: string;
                                        partCustomizations: (Partial<{
                                            __typename?: Partial<"AvatarAvatarPartCustomization" | undefined>;
                                            colors: (string | undefined)[];
                                            lutUrl: string;
                                            partId: string;
                                        }> | undefined)[];
                                        partIds: (string | undefined)[];
                                    }>;
                                    avatarLods: (string | undefined)[];
                                    body: string;
                                    face: string;
                                    gender: string;
                                    id: string;
                                    selectable: Partial<boolean>;
                                }>;
                                modelId: string;
                            } | null | undefined>;
                            avatarUrl: string;
                            avatars?: Partial<{
                                __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                avatar2D: string;
                                avatar3D: string;
                                avatarFullbody: string;
                                avatarGender: string;
                            } | null | undefined>;
                            badges: (Partial<{
                                __typename?: Partial<"BadgeBadge" | undefined>;
                                level: number;
                                nextLevelAt: string;
                                type: Partial<import("@chat-gen").BadgeBadgeType>;
                            }> | undefined)[];
                            bio: string;
                            channel?: Partial<any | null | undefined>;
                            discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            displayName: string;
                            friends: (Partial<any> | undefined)[];
                            friendshipStatus: Partial<{
                                __typename?: Partial<"FriendsFriendshipStatus" | undefined>;
                                activity?: Partial<{
                                    __typename?: Partial<"FriendsActivity" | undefined>;
                                    channel?: Partial<any | null | undefined>;
                                    channelId: string;
                                    isOnline: Partial<boolean>;
                                    streamId: string;
                                } | null | undefined>;
                                lastStatusChange: string;
                                status: Partial<import("@chat-gen").FriendsFriendshipStatusStatus>;
                            }>;
                            lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                            playedGames: (Partial<{
                                __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                game: Partial<{
                                    __typename?: Partial<"GameGame" | undefined>;
                                    activeSeason: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<any>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    }>;
                                    activeSeasonId: string;
                                    backdropUrl: string;
                                    iconUrl: string;
                                    id: string;
                                    name: string;
                                    noicePredictionsEnabled: Partial<boolean>;
                                    progression: Partial<{
                                        __typename?: Partial<"GameUserProgression" | undefined>;
                                        experiencePoints: number;
                                        level: number;
                                        userId: string;
                                    }>;
                                    publicAccess: Partial<boolean>;
                                }>;
                                id: string;
                                lastPlayedAt: string;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                season: Partial<{
                                    __typename?: Partial<"GameSeason" | undefined>;
                                    badgeUrl: string;
                                    cardBackgroundUrls: (Partial<{
                                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        url: string;
                                    }> | undefined)[];
                                    endTime: string;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<any>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    name: string;
                                    progression: Partial<{
                                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                        level: number;
                                        nextLevel: number;
                                        nextLevelThreshold: number;
                                        season: Partial<any>;
                                        seasonId: string;
                                        xpAmount: number;
                                    }>;
                                    progressionPauseReason: string;
                                    progressionPaused: Partial<boolean>;
                                    seasonBreak: Partial<boolean>;
                                    seasonBreakReason: string;
                                    seasonPauseReason: string;
                                    seasonPaused: Partial<boolean>;
                                    startTime: string;
                                }>;
                                seasonId: string;
                                userId: string;
                            }> | undefined)[];
                            settings?: Partial<{
                                __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                friends: Partial<{
                                    __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                    disableFriendRequests: Partial<boolean>;
                                }>;
                                privacy: Partial<{
                                    __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                    anonymisePurchaseHighlights: Partial<boolean>;
                                    discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                    hideOnlineStatus: Partial<boolean>;
                                    showMatureContentWarning: Partial<boolean>;
                                    visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                }>;
                            } | null | undefined>;
                            state: Partial<ApiEntityState>;
                            stats: Partial<{
                                __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                adsWatched: number;
                                boosterUsage?: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                    doubt: number;
                                    goodCall: number;
                                    letsGo: number;
                                    nextUp: number;
                                    scavenge: number;
                                    speedUp: number;
                                    total: number;
                                } | null | undefined>;
                                cardBundlesPurchased: number;
                                cardLevelUps: number;
                                cardsPlayed: number;
                                cardsSucceeded: number;
                                currencySpending?: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                    channelCurrency: number;
                                    hardCurrency: number;
                                    softCurrency: number;
                                } | null | undefined>;
                                dailyGoalCardsCompleted: number;
                                dailyGoalCardsSet: number;
                                matchesPlayed: number;
                                partyMatchesPlayed: number;
                                shufflesUsed: number;
                                soloMatchesPlayed: number;
                                timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            }>;
                            userId: string;
                            userTag: string;
                            visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                        } | null | undefined>;
                        reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                        suspendedAt: string;
                        suspendedBy: string;
                        until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    }>;
                    thumbnail: string;
                    thumbnailUrl: string;
                    title: string;
                    userBanStatus: Partial<{
                        __typename?: Partial<"ChannelUserBanStatus" | undefined>;
                        appeal?: Partial<{
                            __typename?: Partial<"ChannelBanAppealInfo" | undefined>;
                            appealText: string;
                            createdAt: string;
                            reviewer: Partial<any>;
                            reviewerComment: string;
                            reviewerId: string;
                            status: Partial<import("@chat-gen").ChannelAppealStatus>;
                        } | null | undefined>;
                        banned: Partial<boolean>;
                        bannedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        channel: Partial<any>;
                        channelId: string;
                        description: string;
                        moderator?: Partial<{
                            __typename?: Partial<"ProfileProfile" | undefined>;
                            account?: Partial<{
                                __typename?: Partial<"AuthAccount" | undefined>;
                                acceptedTerms: (Partial<{
                                    __typename?: Partial<"AuthTermsVersion" | undefined>;
                                    name: string;
                                    revision: string;
                                    signature: string;
                                }> | undefined)[];
                                birthday?: Partial<{
                                    __typename?: Partial<"AuthDate" | undefined>;
                                    day: number;
                                    month: number;
                                    year: number;
                                } | null | undefined>;
                                createdAt: string;
                                email: string;
                                emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                externalIds: (Partial<{
                                    __typename?: Partial<"AuthIdentity" | undefined>;
                                    id: string;
                                    type: Partial<import("@chat-gen").AuthIdentityType>;
                                }> | undefined)[];
                                flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                                isBot: Partial<boolean>;
                                marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                                matureRatedContentAllowed: Partial<boolean>;
                                pendingAgreements: (Partial<{
                                    __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                                    name: string;
                                    revision: string;
                                    url: string;
                                }> | undefined)[];
                                roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                                signupOrigin?: Partial<{
                                    __typename?: Partial<"AuthSignupOrigin" | undefined>;
                                    origin?: Partial<{
                                        __typename?: Partial<"AuthSignupOriginCampaign" | undefined>;
                                        campaign: string;
                                        content: string;
                                        creator: string;
                                        format: string;
                                        medium: string;
                                        source: string;
                                        term: string;
                                    } | {
                                        __typename?: Partial<"AuthSignupOriginChannel" | undefined>;
                                        channel: Partial<any>;
                                        channelId: string;
                                    } | {
                                        __typename?: Partial<"AuthSignupOriginPage" | undefined>;
                                        url: string;
                                    } | null | undefined>;
                                } | null | undefined>;
                                state: Partial<ApiEntityState>;
                                uid: string;
                            } | null | undefined>;
                            avatarConfig?: Partial<{
                                __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                model: Partial<{
                                    __typename?: Partial<"AvatarAvatar" | undefined>;
                                    avatar3D: string;
                                    avatarComposition: Partial<{
                                        __typename?: Partial<"AvatarAvatarComposition" | undefined>;
                                        generatorVersion: string;
                                        partCustomizations: (Partial<{
                                            __typename?: Partial<"AvatarAvatarPartCustomization" | undefined>;
                                            colors: (string | undefined)[];
                                            lutUrl: string;
                                            partId: string;
                                        }> | undefined)[];
                                        partIds: (string | undefined)[];
                                    }>;
                                    avatarLods: (string | undefined)[];
                                    body: string;
                                    face: string;
                                    gender: string;
                                    id: string;
                                    selectable: Partial<boolean>;
                                }>;
                                modelId: string;
                            } | null | undefined>;
                            avatarUrl: string;
                            avatars?: Partial<{
                                __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                avatar2D: string;
                                avatar3D: string;
                                avatarFullbody: string;
                                avatarGender: string;
                            } | null | undefined>;
                            badges: (Partial<{
                                __typename?: Partial<"BadgeBadge" | undefined>;
                                level: number;
                                nextLevelAt: string;
                                type: Partial<import("@chat-gen").BadgeBadgeType>;
                            }> | undefined)[];
                            bio: string;
                            channel?: Partial<any | null | undefined>;
                            discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            displayName: string;
                            friends: (Partial<any> | undefined)[];
                            friendshipStatus: Partial<{
                                __typename?: Partial<"FriendsFriendshipStatus" | undefined>;
                                activity?: Partial<{
                                    __typename?: Partial<"FriendsActivity" | undefined>;
                                    channel?: Partial<any | null | undefined>;
                                    channelId: string;
                                    isOnline: Partial<boolean>;
                                    streamId: string;
                                } | null | undefined>;
                                lastStatusChange: string;
                                status: Partial<import("@chat-gen").FriendsFriendshipStatusStatus>;
                            }>;
                            lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                            playedGames: (Partial<{
                                __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                game: Partial<{
                                    __typename?: Partial<"GameGame" | undefined>;
                                    activeSeason: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<any>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    }>;
                                    activeSeasonId: string;
                                    backdropUrl: string;
                                    iconUrl: string;
                                    id: string;
                                    name: string;
                                    noicePredictionsEnabled: Partial<boolean>;
                                    progression: Partial<{
                                        __typename?: Partial<"GameUserProgression" | undefined>;
                                        experiencePoints: number;
                                        level: number;
                                        userId: string;
                                    }>;
                                    publicAccess: Partial<boolean>;
                                }>;
                                id: string;
                                lastPlayedAt: string;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                season: Partial<{
                                    __typename?: Partial<"GameSeason" | undefined>;
                                    badgeUrl: string;
                                    cardBackgroundUrls: (Partial<{
                                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        url: string;
                                    }> | undefined)[];
                                    endTime: string;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<any>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    name: string;
                                    progression: Partial<{
                                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                        level: number;
                                        nextLevel: number;
                                        nextLevelThreshold: number;
                                        season: Partial<any>;
                                        seasonId: string;
                                        xpAmount: number;
                                    }>;
                                    progressionPauseReason: string;
                                    progressionPaused: Partial<boolean>;
                                    seasonBreak: Partial<boolean>;
                                    seasonBreakReason: string;
                                    seasonPauseReason: string;
                                    seasonPaused: Partial<boolean>;
                                    startTime: string;
                                }>;
                                seasonId: string;
                                userId: string;
                            }> | undefined)[];
                            settings?: Partial<{
                                __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                friends: Partial<{
                                    __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                    disableFriendRequests: Partial<boolean>;
                                }>;
                                privacy: Partial<{
                                    __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                    anonymisePurchaseHighlights: Partial<boolean>;
                                    discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                    hideOnlineStatus: Partial<boolean>;
                                    showMatureContentWarning: Partial<boolean>;
                                    visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                }>;
                            } | null | undefined>;
                            state: Partial<ApiEntityState>;
                            stats: Partial<{
                                __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                adsWatched: number;
                                boosterUsage?: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                    doubt: number;
                                    goodCall: number;
                                    letsGo: number;
                                    nextUp: number;
                                    scavenge: number;
                                    speedUp: number;
                                    total: number;
                                } | null | undefined>;
                                cardBundlesPurchased: number;
                                cardLevelUps: number;
                                cardsPlayed: number;
                                cardsSucceeded: number;
                                currencySpending?: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                    channelCurrency: number;
                                    hardCurrency: number;
                                    softCurrency: number;
                                } | null | undefined>;
                                dailyGoalCardsCompleted: number;
                                dailyGoalCardsSet: number;
                                matchesPlayed: number;
                                partyMatchesPlayed: number;
                                shufflesUsed: number;
                                soloMatchesPlayed: number;
                                timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            }>;
                            userId: string;
                            userTag: string;
                            visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                        } | null | undefined>;
                        moderatorId: string;
                        user: Partial<any>;
                        userId: string;
                        violation: Partial<import("@chat-gen").ChannelViolation>;
                    }>;
                    viewerCount: number;
                }>;
                channelId: string;
                createdAt: string;
                expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                id: string;
                paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                tier: number;
                userId: string;
            } | null | undefined>;
            subscriptionConfig?: Partial<{
                __typename?: Partial<"SubscriptionChannelSubscriptionConfig" | undefined>;
                channelId: string;
                subscriptionsEnabled: Partial<boolean>;
                tiers: (Partial<{
                    __typename?: Partial<"SubscriptionChannelSubscriptionTier" | undefined>;
                    description: string;
                    entitlements: (Partial<{
                        __typename?: Partial<"SubscriptionChannelSubscriptionEntitlement" | undefined>;
                        amount: number;
                        item: Partial<{
                            __typename?: Partial<"ItemItem" | undefined>;
                            attributes: Partial<{
                                __typename?: Partial<"AttributeAttributeMap" | undefined>;
                                value: (Partial<{
                                    __typename?: Partial<"AttributeAttributeMapValueEntry" | undefined>;
                                    key: string;
                                    value: Partial<{
                                        __typename?: Partial<"AttributeAttribute" | undefined>;
                                        value?: Partial<{
                                            __typename?: Partial<"AttributeAttributeBoolArray" | undefined>;
                                            value: (Partial<boolean> | undefined)[];
                                        } | {
                                            __typename?: Partial<"AttributeAttributeFloatArray" | undefined>;
                                            value: (number | undefined)[];
                                        } | {
                                            __typename?: Partial<"AttributeAttributeIntArray" | undefined>;
                                            value: (number | undefined)[];
                                        } | {
                                            __typename?: Partial<"AttributeAttributeMap" | undefined>;
                                            value: (Partial<any> | undefined)[];
                                        } | {
                                            __typename?: Partial<"AttributeAttributeStringArray" | undefined>;
                                            value: (string | undefined)[];
                                        } | {
                                            __typename?: Partial<"BooleanType" | undefined>;
                                            value: Partial<boolean>;
                                        } | {
                                            __typename?: Partial<"FloatType" | undefined>;
                                            value: number;
                                        } | {
                                            __typename?: Partial<"IntType" | undefined>;
                                            value: number;
                                        } | {
                                            __typename?: Partial<"StringType" | undefined>;
                                            value: string;
                                        } | null | undefined>;
                                    }>;
                                }> | undefined)[];
                            }>;
                            bootstraps?: Partial<Partial<{
                                __typename?: Partial<"ItemItemBootstrap" | undefined>;
                                itemCount: number;
                                itemId: string;
                                revision: string;
                            }>[] | null | undefined>;
                            channelId: string;
                            children?: Partial<Partial<any>[] | null | undefined>;
                            consumable: Partial<boolean>;
                            details?: Partial<{
                                __typename?: Partial<"AvatarAnimation" | undefined>;
                                category: (Partial<import("@chat-gen").AvatarAnimationCategory> | undefined)[];
                                chatCommand: string;
                                config: Partial<{
                                    __typename?: Partial<"AvatarAnimationConfig" | undefined>;
                                    clamp: Partial<boolean>;
                                    fadeInTimeSec: number;
                                    handedness: Partial<import("@chat-gen").AvatarAnimationHandedness>;
                                    interruptible: Partial<boolean>;
                                    maxLoops: number;
                                    randomizeLoops: Partial<boolean>;
                                }>;
                                enabled: Partial<boolean>;
                                glbUrl: string;
                                iconUrl: string;
                                id: string;
                                mirroredGlbUrl: string;
                                name: string;
                            } | {
                                __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                baseCard: Partial<{
                                    __typename?: Partial<"GameLogicCard" | undefined>;
                                    activeStreamerCard?: Partial<{
                                        __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                        baseCard: Partial<any>;
                                        channel: Partial<{
                                            __typename?: Partial<"ChannelChannel" | undefined>;
                                            channelFriends: Partial<any>;
                                            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            currentStreamId: string;
                                            description: string;
                                            features: Partial<any>;
                                            followerCount: number;
                                            following: Partial<boolean>;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            isPublic: Partial<boolean>;
                                            itemStats: (Partial<any> | undefined)[];
                                            links: (Partial<any> | undefined)[];
                                            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                            logo: string;
                                            logoUrl: string;
                                            matureRatedContent: Partial<boolean>;
                                            name: string;
                                            offlineBanner: string;
                                            offlineBannerUrl: string;
                                            playedGameIds: (string | undefined)[];
                                            state: Partial<ApiEntityState>;
                                            streamedGames?: Partial<Partial<any>[] | null | undefined>;
                                            streamer: Partial<any>;
                                            streamerId: string;
                                            subscriberCount: number;
                                            subscription?: Partial<any | null | undefined>;
                                            subscriptionConfig?: Partial<any | null | undefined>;
                                            suspension: Partial<any>;
                                            thumbnail: string;
                                            thumbnailUrl: string;
                                            title: string;
                                            userBanStatus: Partial<any>;
                                            viewerCount: number;
                                        }>;
                                        channelId: string;
                                        draft: Partial<boolean>;
                                        facecam: string;
                                        facecamUrl: string;
                                        familyId: string;
                                        gameId: string;
                                        id: string;
                                        image: string;
                                        imageUrl: string;
                                        name: string;
                                        saleConfig?: Partial<{
                                            __typename?: Partial<"StoreV2StreamerCardSaleConfig" | undefined>;
                                            cardId: string;
                                            channelId: string;
                                            enabled: Partial<boolean>;
                                            excludeFromBundles: Partial<boolean>;
                                            period?: Partial<any | null | undefined>;
                                        } | null | undefined>;
                                        video: string;
                                        videoUrl: string;
                                    } | null | undefined>;
                                    activeStreamerCards: (Partial<{
                                        __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                        baseCard: Partial<any>;
                                        channel: Partial<{
                                            __typename?: Partial<"ChannelChannel" | undefined>;
                                            channelFriends: Partial<any>;
                                            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            currentStreamId: string;
                                            description: string;
                                            features: Partial<any>;
                                            followerCount: number;
                                            following: Partial<boolean>;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            isPublic: Partial<boolean>;
                                            itemStats: (Partial<any> | undefined)[];
                                            links: (Partial<any> | undefined)[];
                                            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                            logo: string;
                                            logoUrl: string;
                                            matureRatedContent: Partial<boolean>;
                                            name: string;
                                            offlineBanner: string;
                                            offlineBannerUrl: string;
                                            playedGameIds: (string | undefined)[];
                                            state: Partial<ApiEntityState>;
                                            streamedGames?: Partial<Partial<any>[] | null | undefined>;
                                            streamer: Partial<any>;
                                            streamerId: string;
                                            subscriberCount: number;
                                            subscription?: Partial<any | null | undefined>;
                                            subscriptionConfig?: Partial<any | null | undefined>;
                                            suspension: Partial<any>;
                                            thumbnail: string;
                                            thumbnailUrl: string;
                                            title: string;
                                            userBanStatus: Partial<any>;
                                            viewerCount: number;
                                        }>;
                                        channelId: string;
                                        draft: Partial<boolean>;
                                        facecam: string;
                                        facecamUrl: string;
                                        familyId: string;
                                        gameId: string;
                                        id: string;
                                        image: string;
                                        imageUrl: string;
                                        name: string;
                                        saleConfig?: Partial<{
                                            __typename?: Partial<"StoreV2StreamerCardSaleConfig" | undefined>;
                                            cardId: string;
                                            channelId: string;
                                            enabled: Partial<boolean>;
                                            excludeFromBundles: Partial<boolean>;
                                            period?: Partial<any | null | undefined>;
                                        } | null | undefined>;
                                        video: string;
                                        videoUrl: string;
                                    }> | undefined)[];
                                    availableStreamerCards: (Partial<{
                                        __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                        baseCard: Partial<any>;
                                        channel: Partial<{
                                            __typename?: Partial<"ChannelChannel" | undefined>;
                                            channelFriends: Partial<any>;
                                            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            currentStreamId: string;
                                            description: string;
                                            features: Partial<any>;
                                            followerCount: number;
                                            following: Partial<boolean>;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            isPublic: Partial<boolean>;
                                            itemStats: (Partial<any> | undefined)[];
                                            links: (Partial<any> | undefined)[];
                                            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                            logo: string;
                                            logoUrl: string;
                                            matureRatedContent: Partial<boolean>;
                                            name: string;
                                            offlineBanner: string;
                                            offlineBannerUrl: string;
                                            playedGameIds: (string | undefined)[];
                                            state: Partial<ApiEntityState>;
                                            streamedGames?: Partial<Partial<any>[] | null | undefined>;
                                            streamer: Partial<any>;
                                            streamerId: string;
                                            subscriberCount: number;
                                            subscription?: Partial<any | null | undefined>;
                                            subscriptionConfig?: Partial<any | null | undefined>;
                                            suspension: Partial<any>;
                                            thumbnail: string;
                                            thumbnailUrl: string;
                                            title: string;
                                            userBanStatus: Partial<any>;
                                            viewerCount: number;
                                        }>;
                                        channelId: string;
                                        draft: Partial<boolean>;
                                        facecam: string;
                                        facecamUrl: string;
                                        familyId: string;
                                        gameId: string;
                                        id: string;
                                        image: string;
                                        imageUrl: string;
                                        name: string;
                                        saleConfig?: Partial<{
                                            __typename?: Partial<"StoreV2StreamerCardSaleConfig" | undefined>;
                                            cardId: string;
                                            channelId: string;
                                            enabled: Partial<boolean>;
                                            excludeFromBundles: Partial<boolean>;
                                            period?: Partial<any | null | undefined>;
                                        } | null | undefined>;
                                        video: string;
                                        videoUrl: string;
                                    }> | undefined)[];
                                    backImage: string;
                                    dealingModules: (string | undefined)[];
                                    description: string;
                                    failureModules: (string | undefined)[];
                                    failureTargetValue: number;
                                    familyId: string;
                                    frontImage: string;
                                    gameModes: (string | undefined)[];
                                    icon: string;
                                    id: string;
                                    isAllOrNothing: Partial<boolean>;
                                    isDealtAtStart: Partial<boolean>;
                                    isEnabled: Partial<boolean>;
                                    isMatchCard: Partial<boolean>;
                                    leveling: Partial<{
                                        __typename?: Partial<"GameLogicCardLeveling" | undefined>;
                                        currentLevel: number;
                                        nextLevelLimit: number;
                                        progressToNextLevel: number;
                                    }>;
                                    matchCardId: number;
                                    name: string;
                                    pointsMax: number;
                                    pointsMin: number;
                                    pointsTimeTarget: number;
                                    rarity: Partial<import("@chat-gen").RarityRarity>;
                                    roleCharacters: (string | undefined)[];
                                    scoredCounterIds: (string | undefined)[];
                                    season: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    }>;
                                    seasonId: string;
                                    sides: (string | undefined)[];
                                    successModules: (string | undefined)[];
                                    targetValue: number;
                                    timerDuration: number;
                                    unlockLevel: number;
                                }>;
                                channel: Partial<{
                                    __typename?: Partial<"ChannelChannel" | undefined>;
                                    channelFriends: Partial<{
                                        __typename?: Partial<"FriendsChannelFriends" | undefined>;
                                        channelId: string;
                                        totalCount: number;
                                        users: (Partial<{
                                            __typename?: Partial<"FriendsUser" | undefined>;
                                            activity?: Partial<any | null | undefined>;
                                            lastStatusChange: string;
                                            profile: Partial<any>;
                                            userId: string;
                                        }> | undefined)[];
                                    }>;
                                    currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    currentStreamId: string;
                                    description: string;
                                    features: Partial<{
                                        __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                                        noicePredictions: Partial<{
                                            __typename?: Partial<"ChannelNoicePredictionsFeatureStatus" | undefined>;
                                            enabled: Partial<boolean>;
                                        }>;
                                        streaming: Partial<{
                                            __typename?: Partial<"ChannelStreamingFeatureStatus" | undefined>;
                                            enabled: Partial<boolean>;
                                            suspension?: Partial<any | null | undefined>;
                                        }>;
                                    }>;
                                    followerCount: number;
                                    following: Partial<boolean>;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    isPublic: Partial<boolean>;
                                    itemStats: (Partial<{
                                        __typename?: Partial<"ItemItemStat" | undefined>;
                                        counts: (Partial<{
                                            __typename?: Partial<"ItemItemCount" | undefined>;
                                            count: number;
                                            type: Partial<import("@chat-gen").ItemItemType>;
                                        }> | undefined)[];
                                        gameId: string;
                                    }> | undefined)[];
                                    links: (Partial<{
                                        __typename?: Partial<"ChannelChannelLink" | undefined>;
                                        name: string;
                                        type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                                        url: string;
                                    }> | undefined)[];
                                    liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                    logo: string;
                                    logoUrl: string;
                                    matureRatedContent: Partial<boolean>;
                                    name: string;
                                    offlineBanner: string;
                                    offlineBannerUrl: string;
                                    playedGameIds: (string | undefined)[];
                                    state: Partial<ApiEntityState>;
                                    streamedGames?: Partial<Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>[] | null | undefined>;
                                    streamer: Partial<any>;
                                    streamerId: string;
                                    subscriberCount: number;
                                    subscription?: Partial<{
                                        __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                                        activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        channel: Partial<any>;
                                        channelId: string;
                                        createdAt: string;
                                        expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        id: string;
                                        paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                                        terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        tier: number;
                                        userId: string;
                                    } | null | undefined>;
                                    subscriptionConfig?: Partial<any | null | undefined>;
                                    suspension: Partial<{
                                        __typename?: Partial<"ChannelSuspension" | undefined>;
                                        description: string;
                                        moderator?: Partial<{
                                            __typename?: Partial<"ProfileProfile" | undefined>;
                                            account?: Partial<any | null | undefined>;
                                            avatarConfig?: Partial<any | null | undefined>;
                                            avatarUrl: string;
                                            avatars?: Partial<any | null | undefined>;
                                            badges: (Partial<any> | undefined)[];
                                            bio: string;
                                            channel?: Partial<any | null | undefined>;
                                            discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            displayName: string;
                                            friends: (Partial<any> | undefined)[];
                                            friendshipStatus: Partial<any>;
                                            lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                            playedGames: (Partial<any> | undefined)[];
                                            settings?: Partial<any | null | undefined>;
                                            state: Partial<ApiEntityState>;
                                            stats: Partial<any>;
                                            userId: string;
                                            userTag: string;
                                            visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                                        } | null | undefined>;
                                        reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                        suspendedAt: string;
                                        suspendedBy: string;
                                        until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    }>;
                                    thumbnail: string;
                                    thumbnailUrl: string;
                                    title: string;
                                    userBanStatus: Partial<{
                                        __typename?: Partial<"ChannelUserBanStatus" | undefined>;
                                        appeal?: Partial<{
                                            __typename?: Partial<"ChannelBanAppealInfo" | undefined>;
                                            appealText: string;
                                            createdAt: string;
                                            reviewer: Partial<any>;
                                            reviewerComment: string;
                                            reviewerId: string;
                                            status: Partial<import("@chat-gen").ChannelAppealStatus>;
                                        } | null | undefined>;
                                        banned: Partial<boolean>;
                                        bannedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        channel: Partial<any>;
                                        channelId: string;
                                        description: string;
                                        moderator?: Partial<{
                                            __typename?: Partial<"ProfileProfile" | undefined>;
                                            account?: Partial<any | null | undefined>;
                                            avatarConfig?: Partial<any | null | undefined>;
                                            avatarUrl: string;
                                            avatars?: Partial<any | null | undefined>;
                                            badges: (Partial<any> | undefined)[];
                                            bio: string;
                                            channel?: Partial<any | null | undefined>;
                                            discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            displayName: string;
                                            friends: (Partial<any> | undefined)[];
                                            friendshipStatus: Partial<any>;
                                            lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                            playedGames: (Partial<any> | undefined)[];
                                            settings?: Partial<any | null | undefined>;
                                            state: Partial<ApiEntityState>;
                                            stats: Partial<any>;
                                            userId: string;
                                            userTag: string;
                                            visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                                        } | null | undefined>;
                                        moderatorId: string;
                                        user: Partial<any>;
                                        userId: string;
                                        violation: Partial<import("@chat-gen").ChannelViolation>;
                                    }>;
                                    viewerCount: number;
                                }>;
                                channelId: string;
                                draft: Partial<boolean>;
                                facecam: string;
                                facecamUrl: string;
                                familyId: string;
                                gameId: string;
                                id: string;
                                image: string;
                                imageUrl: string;
                                name: string;
                                saleConfig?: Partial<{
                                    __typename?: Partial<"StoreV2StreamerCardSaleConfig" | undefined>;
                                    cardId: string;
                                    channelId: string;
                                    enabled: Partial<boolean>;
                                    excludeFromBundles: Partial<boolean>;
                                    period?: Partial<{
                                        __typename?: Partial<"StoreV2Period" | undefined>;
                                        from: string;
                                        until: string;
                                    } | null | undefined>;
                                } | null | undefined>;
                                video: string;
                                videoUrl: string;
                            } | {
                                __typename?: Partial<"EmojiEmoji" | undefined>;
                                channelId: string;
                                disabled: Partial<boolean>;
                                id: string;
                                image: string;
                                imageUrl: string;
                                label: string;
                                name: string;
                                prefabName: string;
                            } | {
                                __typename?: Partial<"GameLogicCard" | undefined>;
                                activeStreamerCard?: Partial<{
                                    __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                    baseCard: Partial<{
                                        __typename?: Partial<"GameLogicCard" | undefined>;
                                        activeStreamerCard?: Partial<any | null | undefined>;
                                        activeStreamerCards: (Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        }> | undefined)[];
                                        availableStreamerCards: (Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        }> | undefined)[];
                                        backImage: string;
                                        dealingModules: (string | undefined)[];
                                        description: string;
                                        failureModules: (string | undefined)[];
                                        failureTargetValue: number;
                                        familyId: string;
                                        frontImage: string;
                                        gameModes: (string | undefined)[];
                                        icon: string;
                                        id: string;
                                        isAllOrNothing: Partial<boolean>;
                                        isDealtAtStart: Partial<boolean>;
                                        isEnabled: Partial<boolean>;
                                        isMatchCard: Partial<boolean>;
                                        leveling: Partial<{
                                            __typename?: Partial<"GameLogicCardLeveling" | undefined>;
                                            currentLevel: number;
                                            nextLevelLimit: number;
                                            progressToNextLevel: number;
                                        }>;
                                        matchCardId: number;
                                        name: string;
                                        pointsMax: number;
                                        pointsMin: number;
                                        pointsTimeTarget: number;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        roleCharacters: (string | undefined)[];
                                        scoredCounterIds: (string | undefined)[];
                                        season: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        seasonId: string;
                                        sides: (string | undefined)[];
                                        successModules: (string | undefined)[];
                                        targetValue: number;
                                        timerDuration: number;
                                        unlockLevel: number;
                                    }>;
                                    channel: Partial<{
                                        __typename?: Partial<"ChannelChannel" | undefined>;
                                        channelFriends: Partial<{
                                            __typename?: Partial<"FriendsChannelFriends" | undefined>;
                                            channelId: string;
                                            totalCount: number;
                                            users: (Partial<any> | undefined)[];
                                        }>;
                                        currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        currentStreamId: string;
                                        description: string;
                                        features: Partial<{
                                            __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                                            noicePredictions: Partial<any>;
                                            streaming: Partial<any>;
                                        }>;
                                        followerCount: number;
                                        following: Partial<boolean>;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        gameId: string;
                                        id: string;
                                        isPublic: Partial<boolean>;
                                        itemStats: (Partial<{
                                            __typename?: Partial<"ItemItemStat" | undefined>;
                                            counts: (Partial<any> | undefined)[];
                                            gameId: string;
                                        }> | undefined)[];
                                        links: (Partial<{
                                            __typename?: Partial<"ChannelChannelLink" | undefined>;
                                            name: string;
                                            type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                                            url: string;
                                        }> | undefined)[];
                                        liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                        logo: string;
                                        logoUrl: string;
                                        matureRatedContent: Partial<boolean>;
                                        name: string;
                                        offlineBanner: string;
                                        offlineBannerUrl: string;
                                        playedGameIds: (string | undefined)[];
                                        state: Partial<ApiEntityState>;
                                        streamedGames?: Partial<Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>[] | null | undefined>;
                                        streamer: Partial<any>;
                                        streamerId: string;
                                        subscriberCount: number;
                                        subscription?: Partial<{
                                            __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                                            activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            createdAt: string;
                                            expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            id: string;
                                            paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                                            terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            tier: number;
                                            userId: string;
                                        } | null | undefined>;
                                        subscriptionConfig?: Partial<any | null | undefined>;
                                        suspension: Partial<{
                                            __typename?: Partial<"ChannelSuspension" | undefined>;
                                            description: string;
                                            moderator?: Partial<any | null | undefined>;
                                            reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                            suspendedAt: string;
                                            suspendedBy: string;
                                            until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        }>;
                                        thumbnail: string;
                                        thumbnailUrl: string;
                                        title: string;
                                        userBanStatus: Partial<{
                                            __typename?: Partial<"ChannelUserBanStatus" | undefined>;
                                            appeal?: Partial<any | null | undefined>;
                                            banned: Partial<boolean>;
                                            bannedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            description: string;
                                            moderator?: Partial<any | null | undefined>;
                                            moderatorId: string;
                                            user: Partial<any>;
                                            userId: string;
                                            violation: Partial<import("@chat-gen").ChannelViolation>;
                                        }>;
                                        viewerCount: number;
                                    }>;
                                    channelId: string;
                                    draft: Partial<boolean>;
                                    facecam: string;
                                    facecamUrl: string;
                                    familyId: string;
                                    gameId: string;
                                    id: string;
                                    image: string;
                                    imageUrl: string;
                                    name: string;
                                    saleConfig?: Partial<{
                                        __typename?: Partial<"StoreV2StreamerCardSaleConfig" | undefined>;
                                        cardId: string;
                                        channelId: string;
                                        enabled: Partial<boolean>;
                                        excludeFromBundles: Partial<boolean>;
                                        period?: Partial<{
                                            __typename?: Partial<"StoreV2Period" | undefined>;
                                            from: string;
                                            until: string;
                                        } | null | undefined>;
                                    } | null | undefined>;
                                    video: string;
                                    videoUrl: string;
                                } | null | undefined>;
                                activeStreamerCards: (Partial<{
                                    __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                    baseCard: Partial<{
                                        __typename?: Partial<"GameLogicCard" | undefined>;
                                        activeStreamerCard?: Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        } | null | undefined>;
                                        activeStreamerCards: (Partial<any> | undefined)[];
                                        availableStreamerCards: (Partial<any> | undefined)[];
                                        backImage: string;
                                        dealingModules: (string | undefined)[];
                                        description: string;
                                        failureModules: (string | undefined)[];
                                        failureTargetValue: number;
                                        familyId: string;
                                        frontImage: string;
                                        gameModes: (string | undefined)[];
                                        icon: string;
                                        id: string;
                                        isAllOrNothing: Partial<boolean>;
                                        isDealtAtStart: Partial<boolean>;
                                        isEnabled: Partial<boolean>;
                                        isMatchCard: Partial<boolean>;
                                        leveling: Partial<{
                                            __typename?: Partial<"GameLogicCardLeveling" | undefined>;
                                            currentLevel: number;
                                            nextLevelLimit: number;
                                            progressToNextLevel: number;
                                        }>;
                                        matchCardId: number;
                                        name: string;
                                        pointsMax: number;
                                        pointsMin: number;
                                        pointsTimeTarget: number;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        roleCharacters: (string | undefined)[];
                                        scoredCounterIds: (string | undefined)[];
                                        season: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        seasonId: string;
                                        sides: (string | undefined)[];
                                        successModules: (string | undefined)[];
                                        targetValue: number;
                                        timerDuration: number;
                                        unlockLevel: number;
                                    }>;
                                    channel: Partial<{
                                        __typename?: Partial<"ChannelChannel" | undefined>;
                                        channelFriends: Partial<{
                                            __typename?: Partial<"FriendsChannelFriends" | undefined>;
                                            channelId: string;
                                            totalCount: number;
                                            users: (Partial<any> | undefined)[];
                                        }>;
                                        currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        currentStreamId: string;
                                        description: string;
                                        features: Partial<{
                                            __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                                            noicePredictions: Partial<any>;
                                            streaming: Partial<any>;
                                        }>;
                                        followerCount: number;
                                        following: Partial<boolean>;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        gameId: string;
                                        id: string;
                                        isPublic: Partial<boolean>;
                                        itemStats: (Partial<{
                                            __typename?: Partial<"ItemItemStat" | undefined>;
                                            counts: (Partial<any> | undefined)[];
                                            gameId: string;
                                        }> | undefined)[];
                                        links: (Partial<{
                                            __typename?: Partial<"ChannelChannelLink" | undefined>;
                                            name: string;
                                            type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                                            url: string;
                                        }> | undefined)[];
                                        liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                        logo: string;
                                        logoUrl: string;
                                        matureRatedContent: Partial<boolean>;
                                        name: string;
                                        offlineBanner: string;
                                        offlineBannerUrl: string;
                                        playedGameIds: (string | undefined)[];
                                        state: Partial<ApiEntityState>;
                                        streamedGames?: Partial<Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>[] | null | undefined>;
                                        streamer: Partial<any>;
                                        streamerId: string;
                                        subscriberCount: number;
                                        subscription?: Partial<{
                                            __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                                            activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            createdAt: string;
                                            expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            id: string;
                                            paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                                            terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            tier: number;
                                            userId: string;
                                        } | null | undefined>;
                                        subscriptionConfig?: Partial<any | null | undefined>;
                                        suspension: Partial<{
                                            __typename?: Partial<"ChannelSuspension" | undefined>;
                                            description: string;
                                            moderator?: Partial<any | null | undefined>;
                                            reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                            suspendedAt: string;
                                            suspendedBy: string;
                                            until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        }>;
                                        thumbnail: string;
                                        thumbnailUrl: string;
                                        title: string;
                                        userBanStatus: Partial<{
                                            __typename?: Partial<"ChannelUserBanStatus" | undefined>;
                                            appeal?: Partial<any | null | undefined>;
                                            banned: Partial<boolean>;
                                            bannedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            description: string;
                                            moderator?: Partial<any | null | undefined>;
                                            moderatorId: string;
                                            user: Partial<any>;
                                            userId: string;
                                            violation: Partial<import("@chat-gen").ChannelViolation>;
                                        }>;
                                        viewerCount: number;
                                    }>;
                                    channelId: string;
                                    draft: Partial<boolean>;
                                    facecam: string;
                                    facecamUrl: string;
                                    familyId: string;
                                    gameId: string;
                                    id: string;
                                    image: string;
                                    imageUrl: string;
                                    name: string;
                                    saleConfig?: Partial<{
                                        __typename?: Partial<"StoreV2StreamerCardSaleConfig" | undefined>;
                                        cardId: string;
                                        channelId: string;
                                        enabled: Partial<boolean>;
                                        excludeFromBundles: Partial<boolean>;
                                        period?: Partial<{
                                            __typename?: Partial<"StoreV2Period" | undefined>;
                                            from: string;
                                            until: string;
                                        } | null | undefined>;
                                    } | null | undefined>;
                                    video: string;
                                    videoUrl: string;
                                }> | undefined)[];
                                availableStreamerCards: (Partial<{
                                    __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                    baseCard: Partial<{
                                        __typename?: Partial<"GameLogicCard" | undefined>;
                                        activeStreamerCard?: Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        } | null | undefined>;
                                        activeStreamerCards: (Partial<any> | undefined)[];
                                        availableStreamerCards: (Partial<any> | undefined)[];
                                        backImage: string;
                                        dealingModules: (string | undefined)[];
                                        description: string;
                                        failureModules: (string | undefined)[];
                                        failureTargetValue: number;
                                        familyId: string;
                                        frontImage: string;
                                        gameModes: (string | undefined)[];
                                        icon: string;
                                        id: string;
                                        isAllOrNothing: Partial<boolean>;
                                        isDealtAtStart: Partial<boolean>;
                                        isEnabled: Partial<boolean>;
                                        isMatchCard: Partial<boolean>;
                                        leveling: Partial<{
                                            __typename?: Partial<"GameLogicCardLeveling" | undefined>;
                                            currentLevel: number;
                                            nextLevelLimit: number;
                                            progressToNextLevel: number;
                                        }>;
                                        matchCardId: number;
                                        name: string;
                                        pointsMax: number;
                                        pointsMin: number;
                                        pointsTimeTarget: number;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        roleCharacters: (string | undefined)[];
                                        scoredCounterIds: (string | undefined)[];
                                        season: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        seasonId: string;
                                        sides: (string | undefined)[];
                                        successModules: (string | undefined)[];
                                        targetValue: number;
                                        timerDuration: number;
                                        unlockLevel: number;
                                    }>;
                                    channel: Partial<{
                                        __typename?: Partial<"ChannelChannel" | undefined>;
                                        channelFriends: Partial<{
                                            __typename?: Partial<"FriendsChannelFriends" | undefined>;
                                            channelId: string;
                                            totalCount: number;
                                            users: (Partial<any> | undefined)[];
                                        }>;
                                        currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        currentStreamId: string;
                                        description: string;
                                        features: Partial<{
                                            __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                                            noicePredictions: Partial<any>;
                                            streaming: Partial<any>;
                                        }>;
                                        followerCount: number;
                                        following: Partial<boolean>;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        gameId: string;
                                        id: string;
                                        isPublic: Partial<boolean>;
                                        itemStats: (Partial<{
                                            __typename?: Partial<"ItemItemStat" | undefined>;
                                            counts: (Partial<any> | undefined)[];
                                            gameId: string;
                                        }> | undefined)[];
                                        links: (Partial<{
                                            __typename?: Partial<"ChannelChannelLink" | undefined>;
                                            name: string;
                                            type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                                            url: string;
                                        }> | undefined)[];
                                        liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                        logo: string;
                                        logoUrl: string;
                                        matureRatedContent: Partial<boolean>;
                                        name: string;
                                        offlineBanner: string;
                                        offlineBannerUrl: string;
                                        playedGameIds: (string | undefined)[];
                                        state: Partial<ApiEntityState>;
                                        streamedGames?: Partial<Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>[] | null | undefined>;
                                        streamer: Partial<any>;
                                        streamerId: string;
                                        subscriberCount: number;
                                        subscription?: Partial<{
                                            __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                                            activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            createdAt: string;
                                            expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            id: string;
                                            paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                                            terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            tier: number;
                                            userId: string;
                                        } | null | undefined>;
                                        subscriptionConfig?: Partial<any | null | undefined>;
                                        suspension: Partial<{
                                            __typename?: Partial<"ChannelSuspension" | undefined>;
                                            description: string;
                                            moderator?: Partial<any | null | undefined>;
                                            reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                            suspendedAt: string;
                                            suspendedBy: string;
                                            until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        }>;
                                        thumbnail: string;
                                        thumbnailUrl: string;
                                        title: string;
                                        userBanStatus: Partial<{
                                            __typename?: Partial<"ChannelUserBanStatus" | undefined>;
                                            appeal?: Partial<any | null | undefined>;
                                            banned: Partial<boolean>;
                                            bannedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            description: string;
                                            moderator?: Partial<any | null | undefined>;
                                            moderatorId: string;
                                            user: Partial<any>;
                                            userId: string;
                                            violation: Partial<import("@chat-gen").ChannelViolation>;
                                        }>;
                                        viewerCount: number;
                                    }>;
                                    channelId: string;
                                    draft: Partial<boolean>;
                                    facecam: string;
                                    facecamUrl: string;
                                    familyId: string;
                                    gameId: string;
                                    id: string;
                                    image: string;
                                    imageUrl: string;
                                    name: string;
                                    saleConfig?: Partial<{
                                        __typename?: Partial<"StoreV2StreamerCardSaleConfig" | undefined>;
                                        cardId: string;
                                        channelId: string;
                                        enabled: Partial<boolean>;
                                        excludeFromBundles: Partial<boolean>;
                                        period?: Partial<{
                                            __typename?: Partial<"StoreV2Period" | undefined>;
                                            from: string;
                                            until: string;
                                        } | null | undefined>;
                                    } | null | undefined>;
                                    video: string;
                                    videoUrl: string;
                                }> | undefined)[];
                                backImage: string;
                                dealingModules: (string | undefined)[];
                                description: string;
                                failureModules: (string | undefined)[];
                                failureTargetValue: number;
                                familyId: string;
                                frontImage: string;
                                gameModes: (string | undefined)[];
                                icon: string;
                                id: string;
                                isAllOrNothing: Partial<boolean>;
                                isDealtAtStart: Partial<boolean>;
                                isEnabled: Partial<boolean>;
                                isMatchCard: Partial<boolean>;
                                leveling: Partial<{
                                    __typename?: Partial<"GameLogicCardLeveling" | undefined>;
                                    currentLevel: number;
                                    nextLevelLimit: number;
                                    progressToNextLevel: number;
                                }>;
                                matchCardId: number;
                                name: string;
                                pointsMax: number;
                                pointsMin: number;
                                pointsTimeTarget: number;
                                rarity: Partial<import("@chat-gen").RarityRarity>;
                                roleCharacters: (string | undefined)[];
                                scoredCounterIds: (string | undefined)[];
                                season: Partial<{
                                    __typename?: Partial<"GameSeason" | undefined>;
                                    badgeUrl: string;
                                    cardBackgroundUrls: (Partial<{
                                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        url: string;
                                    }> | undefined)[];
                                    endTime: string;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<any>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    name: string;
                                    progression: Partial<{
                                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                        level: number;
                                        nextLevel: number;
                                        nextLevelThreshold: number;
                                        season: Partial<any>;
                                        seasonId: string;
                                        xpAmount: number;
                                    }>;
                                    progressionPauseReason: string;
                                    progressionPaused: Partial<boolean>;
                                    seasonBreak: Partial<boolean>;
                                    seasonBreakReason: string;
                                    seasonPauseReason: string;
                                    seasonPaused: Partial<boolean>;
                                    startTime: string;
                                }>;
                                seasonId: string;
                                sides: (string | undefined)[];
                                successModules: (string | undefined)[];
                                targetValue: number;
                                timerDuration: number;
                                unlockLevel: number;
                            } | null | undefined>;
                            disabled: Partial<boolean>;
                            game: Partial<{
                                __typename?: Partial<"GameGame" | undefined>;
                                activeSeason: Partial<{
                                    __typename?: Partial<"GameSeason" | undefined>;
                                    badgeUrl: string;
                                    cardBackgroundUrls: (Partial<{
                                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        url: string;
                                    }> | undefined)[];
                                    endTime: string;
                                    game: Partial<any>;
                                    gameId: string;
                                    id: string;
                                    name: string;
                                    progression: Partial<{
                                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                        level: number;
                                        nextLevel: number;
                                        nextLevelThreshold: number;
                                        season: Partial<any>;
                                        seasonId: string;
                                        xpAmount: number;
                                    }>;
                                    progressionPauseReason: string;
                                    progressionPaused: Partial<boolean>;
                                    seasonBreak: Partial<boolean>;
                                    seasonBreakReason: string;
                                    seasonPauseReason: string;
                                    seasonPaused: Partial<boolean>;
                                    startTime: string;
                                }>;
                                activeSeasonId: string;
                                backdropUrl: string;
                                iconUrl: string;
                                id: string;
                                name: string;
                                noicePredictionsEnabled: Partial<boolean>;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                publicAccess: Partial<boolean>;
                            }>;
                            gameId: string;
                            id: string;
                            inventoryItem: Partial<{
                                __typename?: Partial<"InventoryInventoryItem" | undefined>;
                                item: Partial<any>;
                                itemCount: number;
                                itemId: string;
                            }>;
                            name: string;
                            parentItemId: string;
                            season?: Partial<{
                                __typename?: Partial<"GameSeason" | undefined>;
                                badgeUrl: string;
                                cardBackgroundUrls: (Partial<{
                                    __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                    rarity: Partial<import("@chat-gen").RarityRarity>;
                                    url: string;
                                }> | undefined)[];
                                endTime: string;
                                game: Partial<{
                                    __typename?: Partial<"GameGame" | undefined>;
                                    activeSeason: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<any>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    }>;
                                    activeSeasonId: string;
                                    backdropUrl: string;
                                    iconUrl: string;
                                    id: string;
                                    name: string;
                                    noicePredictionsEnabled: Partial<boolean>;
                                    progression: Partial<{
                                        __typename?: Partial<"GameUserProgression" | undefined>;
                                        experiencePoints: number;
                                        level: number;
                                        userId: string;
                                    }>;
                                    publicAccess: Partial<boolean>;
                                }>;
                                gameId: string;
                                id: string;
                                name: string;
                                progression: Partial<{
                                    __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                    level: number;
                                    nextLevel: number;
                                    nextLevelThreshold: number;
                                    season: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<any>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    }>;
                                    seasonId: string;
                                    xpAmount: number;
                                }>;
                                progressionPauseReason: string;
                                progressionPaused: Partial<boolean>;
                                seasonBreak: Partial<boolean>;
                                seasonBreakReason: string;
                                seasonPauseReason: string;
                                seasonPaused: Partial<boolean>;
                                startTime: string;
                            } | null | undefined>;
                            seasonId: string;
                            type: Partial<import("@chat-gen").ItemItemType>;
                            unlockItemId: string;
                        }>;
                        itemId: string;
                    }> | undefined)[];
                    level: number;
                    name: string;
                    prices: (Partial<{
                        __typename?: Partial<"SubscriptionSubscriptionPrice" | undefined>;
                        period: Partial<import("@chat-gen").SubscriptionSubscriptionPricePeriod>;
                        price: number;
                    }> | undefined)[];
                }> | undefined)[];
            } | null | undefined>;
            suspension: Partial<{
                __typename?: Partial<"ChannelSuspension" | undefined>;
                description: string;
                moderator?: Partial<{
                    __typename?: Partial<"ProfileProfile" | undefined>;
                    account?: Partial<{
                        __typename?: Partial<"AuthAccount" | undefined>;
                        acceptedTerms: (Partial<{
                            __typename?: Partial<"AuthTermsVersion" | undefined>;
                            name: string;
                            revision: string;
                            signature: string;
                        }> | undefined)[];
                        birthday?: Partial<{
                            __typename?: Partial<"AuthDate" | undefined>;
                            day: number;
                            month: number;
                            year: number;
                        } | null | undefined>;
                        createdAt: string;
                        email: string;
                        emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        externalIds: (Partial<{
                            __typename?: Partial<"AuthIdentity" | undefined>;
                            id: string;
                            type: Partial<import("@chat-gen").AuthIdentityType>;
                        }> | undefined)[];
                        flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                        isBot: Partial<boolean>;
                        marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                        matureRatedContentAllowed: Partial<boolean>;
                        pendingAgreements: (Partial<{
                            __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                            name: string;
                            revision: string;
                            url: string;
                        }> | undefined)[];
                        roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                        signupOrigin?: Partial<{
                            __typename?: Partial<"AuthSignupOrigin" | undefined>;
                            origin?: Partial<{
                                __typename?: Partial<"AuthSignupOriginCampaign" | undefined>;
                                campaign: string;
                                content: string;
                                creator: string;
                                format: string;
                                medium: string;
                                source: string;
                                term: string;
                            } | {
                                __typename?: Partial<"AuthSignupOriginChannel" | undefined>;
                                channel: Partial<{
                                    __typename?: Partial<"ChannelChannel" | undefined>;
                                    channelFriends: Partial<{
                                        __typename?: Partial<"FriendsChannelFriends" | undefined>;
                                        channelId: string;
                                        totalCount: number;
                                        users: (Partial<{
                                            __typename?: Partial<"FriendsUser" | undefined>;
                                            activity?: Partial<any | null | undefined>;
                                            lastStatusChange: string;
                                            profile: Partial<any>;
                                            userId: string;
                                        }> | undefined)[];
                                    }>;
                                    currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    currentStreamId: string;
                                    description: string;
                                    features: Partial<{
                                        __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                                        noicePredictions: Partial<{
                                            __typename?: Partial<"ChannelNoicePredictionsFeatureStatus" | undefined>;
                                            enabled: Partial<boolean>;
                                        }>;
                                        streaming: Partial<{
                                            __typename?: Partial<"ChannelStreamingFeatureStatus" | undefined>;
                                            enabled: Partial<boolean>;
                                            suspension?: Partial<any | null | undefined>;
                                        }>;
                                    }>;
                                    followerCount: number;
                                    following: Partial<boolean>;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    isPublic: Partial<boolean>;
                                    itemStats: (Partial<{
                                        __typename?: Partial<"ItemItemStat" | undefined>;
                                        counts: (Partial<{
                                            __typename?: Partial<"ItemItemCount" | undefined>;
                                            count: number;
                                            type: Partial<import("@chat-gen").ItemItemType>;
                                        }> | undefined)[];
                                        gameId: string;
                                    }> | undefined)[];
                                    links: (Partial<{
                                        __typename?: Partial<"ChannelChannelLink" | undefined>;
                                        name: string;
                                        type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                                        url: string;
                                    }> | undefined)[];
                                    liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                    logo: string;
                                    logoUrl: string;
                                    matureRatedContent: Partial<boolean>;
                                    name: string;
                                    offlineBanner: string;
                                    offlineBannerUrl: string;
                                    playedGameIds: (string | undefined)[];
                                    state: Partial<ApiEntityState>;
                                    streamedGames?: Partial<Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>[] | null | undefined>;
                                    streamer: Partial<any>;
                                    streamerId: string;
                                    subscriberCount: number;
                                    subscription?: Partial<{
                                        __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                                        activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        channel: Partial<any>;
                                        channelId: string;
                                        createdAt: string;
                                        expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        id: string;
                                        paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                                        terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        tier: number;
                                        userId: string;
                                    } | null | undefined>;
                                    subscriptionConfig?: Partial<{
                                        __typename?: Partial<"SubscriptionChannelSubscriptionConfig" | undefined>;
                                        channelId: string;
                                        subscriptionsEnabled: Partial<boolean>;
                                        tiers: (Partial<{
                                            __typename?: Partial<"SubscriptionChannelSubscriptionTier" | undefined>;
                                            description: string;
                                            entitlements: (Partial<any> | undefined)[];
                                            level: number;
                                            name: string;
                                            prices: (Partial<any> | undefined)[];
                                        }> | undefined)[];
                                    } | null | undefined>;
                                    suspension: Partial<any>;
                                    thumbnail: string;
                                    thumbnailUrl: string;
                                    title: string;
                                    userBanStatus: Partial<{
                                        __typename?: Partial<"ChannelUserBanStatus" | undefined>;
                                        appeal?: Partial<{
                                            __typename?: Partial<"ChannelBanAppealInfo" | undefined>;
                                            appealText: string;
                                            createdAt: string;
                                            reviewer: Partial<any>;
                                            reviewerComment: string;
                                            reviewerId: string;
                                            status: Partial<import("@chat-gen").ChannelAppealStatus>;
                                        } | null | undefined>;
                                        banned: Partial<boolean>;
                                        bannedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        channel: Partial<any>;
                                        channelId: string;
                                        description: string;
                                        moderator?: Partial<any | null | undefined>;
                                        moderatorId: string;
                                        user: Partial<any>;
                                        userId: string;
                                        violation: Partial<import("@chat-gen").ChannelViolation>;
                                    }>;
                                    viewerCount: number;
                                }>;
                                channelId: string;
                            } | {
                                __typename?: Partial<"AuthSignupOriginPage" | undefined>;
                                url: string;
                            } | null | undefined>;
                        } | null | undefined>;
                        state: Partial<ApiEntityState>;
                        uid: string;
                    } | null | undefined>;
                    avatarConfig?: Partial<{
                        __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                        model: Partial<{
                            __typename?: Partial<"AvatarAvatar" | undefined>;
                            avatar3D: string;
                            avatarComposition: Partial<{
                                __typename?: Partial<"AvatarAvatarComposition" | undefined>;
                                generatorVersion: string;
                                partCustomizations: (Partial<{
                                    __typename?: Partial<"AvatarAvatarPartCustomization" | undefined>;
                                    colors: (string | undefined)[];
                                    lutUrl: string;
                                    partId: string;
                                }> | undefined)[];
                                partIds: (string | undefined)[];
                            }>;
                            avatarLods: (string | undefined)[];
                            body: string;
                            face: string;
                            gender: string;
                            id: string;
                            selectable: Partial<boolean>;
                        }>;
                        modelId: string;
                    } | null | undefined>;
                    avatarUrl: string;
                    avatars?: Partial<{
                        __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                        avatar2D: string;
                        avatar3D: string;
                        avatarFullbody: string;
                        avatarGender: string;
                    } | null | undefined>;
                    badges: (Partial<{
                        __typename?: Partial<"BadgeBadge" | undefined>;
                        level: number;
                        nextLevelAt: string;
                        type: Partial<import("@chat-gen").BadgeBadgeType>;
                    }> | undefined)[];
                    bio: string;
                    channel?: Partial<any | null | undefined>;
                    discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    displayName: string;
                    friends: (Partial<any> | undefined)[];
                    friendshipStatus: Partial<{
                        __typename?: Partial<"FriendsFriendshipStatus" | undefined>;
                        activity?: Partial<{
                            __typename?: Partial<"FriendsActivity" | undefined>;
                            channel?: Partial<any | null | undefined>;
                            channelId: string;
                            isOnline: Partial<boolean>;
                            streamId: string;
                        } | null | undefined>;
                        lastStatusChange: string;
                        status: Partial<import("@chat-gen").FriendsFriendshipStatusStatus>;
                    }>;
                    lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                    playedGames: (Partial<{
                        __typename?: Partial<"ProfilePlayedGame" | undefined>;
                        game: Partial<{
                            __typename?: Partial<"GameGame" | undefined>;
                            activeSeason: Partial<{
                                __typename?: Partial<"GameSeason" | undefined>;
                                badgeUrl: string;
                                cardBackgroundUrls: (Partial<{
                                    __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                    rarity: Partial<import("@chat-gen").RarityRarity>;
                                    url: string;
                                }> | undefined)[];
                                endTime: string;
                                game: Partial<any>;
                                gameId: string;
                                id: string;
                                name: string;
                                progression: Partial<{
                                    __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                    level: number;
                                    nextLevel: number;
                                    nextLevelThreshold: number;
                                    season: Partial<any>;
                                    seasonId: string;
                                    xpAmount: number;
                                }>;
                                progressionPauseReason: string;
                                progressionPaused: Partial<boolean>;
                                seasonBreak: Partial<boolean>;
                                seasonBreakReason: string;
                                seasonPauseReason: string;
                                seasonPaused: Partial<boolean>;
                                startTime: string;
                            }>;
                            activeSeasonId: string;
                            backdropUrl: string;
                            iconUrl: string;
                            id: string;
                            name: string;
                            noicePredictionsEnabled: Partial<boolean>;
                            progression: Partial<{
                                __typename?: Partial<"GameUserProgression" | undefined>;
                                experiencePoints: number;
                                level: number;
                                userId: string;
                            }>;
                            publicAccess: Partial<boolean>;
                        }>;
                        id: string;
                        lastPlayedAt: string;
                        progression: Partial<{
                            __typename?: Partial<"GameUserProgression" | undefined>;
                            experiencePoints: number;
                            level: number;
                            userId: string;
                        }>;
                        season: Partial<{
                            __typename?: Partial<"GameSeason" | undefined>;
                            badgeUrl: string;
                            cardBackgroundUrls: (Partial<{
                                __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                rarity: Partial<import("@chat-gen").RarityRarity>;
                                url: string;
                            }> | undefined)[];
                            endTime: string;
                            game: Partial<{
                                __typename?: Partial<"GameGame" | undefined>;
                                activeSeason: Partial<any>;
                                activeSeasonId: string;
                                backdropUrl: string;
                                iconUrl: string;
                                id: string;
                                name: string;
                                noicePredictionsEnabled: Partial<boolean>;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                publicAccess: Partial<boolean>;
                            }>;
                            gameId: string;
                            id: string;
                            name: string;
                            progression: Partial<{
                                __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                level: number;
                                nextLevel: number;
                                nextLevelThreshold: number;
                                season: Partial<any>;
                                seasonId: string;
                                xpAmount: number;
                            }>;
                            progressionPauseReason: string;
                            progressionPaused: Partial<boolean>;
                            seasonBreak: Partial<boolean>;
                            seasonBreakReason: string;
                            seasonPauseReason: string;
                            seasonPaused: Partial<boolean>;
                            startTime: string;
                        }>;
                        seasonId: string;
                        userId: string;
                    }> | undefined)[];
                    settings?: Partial<{
                        __typename?: Partial<"ProfileProfileSettings" | undefined>;
                        friends: Partial<{
                            __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                            disableFriendRequests: Partial<boolean>;
                        }>;
                        privacy: Partial<{
                            __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                            anonymisePurchaseHighlights: Partial<boolean>;
                            discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                            hideOnlineStatus: Partial<boolean>;
                            showMatureContentWarning: Partial<boolean>;
                            visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                        }>;
                    } | null | undefined>;
                    state: Partial<ApiEntityState>;
                    stats: Partial<{
                        __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                        adsWatched: number;
                        boosterUsage?: Partial<{
                            __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                            doubt: number;
                            goodCall: number;
                            letsGo: number;
                            nextUp: number;
                            scavenge: number;
                            speedUp: number;
                            total: number;
                        } | null | undefined>;
                        cardBundlesPurchased: number;
                        cardLevelUps: number;
                        cardsPlayed: number;
                        cardsSucceeded: number;
                        currencySpending?: Partial<{
                            __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                            channelCurrency: number;
                            hardCurrency: number;
                            softCurrency: number;
                        } | null | undefined>;
                        dailyGoalCardsCompleted: number;
                        dailyGoalCardsSet: number;
                        matchesPlayed: number;
                        partyMatchesPlayed: number;
                        shufflesUsed: number;
                        soloMatchesPlayed: number;
                        timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    }>;
                    userId: string;
                    userTag: string;
                    visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                } | null | undefined>;
                reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                suspendedAt: string;
                suspendedBy: string;
                until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
            }>;
            thumbnail: string;
            thumbnailUrl: string;
            title: string;
            userBanStatus: Partial<{
                __typename?: Partial<"ChannelUserBanStatus" | undefined>;
                appeal?: Partial<{
                    __typename?: Partial<"ChannelBanAppealInfo" | undefined>;
                    appealText: string;
                    createdAt: string;
                    reviewer: Partial<any>;
                    reviewerComment: string;
                    reviewerId: string;
                    status: Partial<import("@chat-gen").ChannelAppealStatus>;
                } | null | undefined>;
                banned: Partial<boolean>;
                bannedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                channel: Partial<{
                    __typename?: Partial<"ChannelChannel" | undefined>;
                    channelFriends: Partial<{
                        __typename?: Partial<"FriendsChannelFriends" | undefined>;
                        channelId: string;
                        totalCount: number;
                        users: (Partial<{
                            __typename?: Partial<"FriendsUser" | undefined>;
                            activity?: Partial<{
                                __typename?: Partial<"FriendsActivity" | undefined>;
                                channel?: Partial<any | null | undefined>;
                                channelId: string;
                                isOnline: Partial<boolean>;
                                streamId: string;
                            } | null | undefined>;
                            lastStatusChange: string;
                            profile: Partial<any>;
                            userId: string;
                        }> | undefined)[];
                    }>;
                    currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    currentStreamId: string;
                    description: string;
                    features: Partial<{
                        __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                        noicePredictions: Partial<{
                            __typename?: Partial<"ChannelNoicePredictionsFeatureStatus" | undefined>;
                            enabled: Partial<boolean>;
                        }>;
                        streaming: Partial<{
                            __typename?: Partial<"ChannelStreamingFeatureStatus" | undefined>;
                            enabled: Partial<boolean>;
                            suspension?: Partial<{
                                __typename?: Partial<"ChannelSuspension" | undefined>;
                                description: string;
                                moderator?: Partial<{
                                    __typename?: Partial<"ProfileProfile" | undefined>;
                                    account?: Partial<{
                                        __typename?: Partial<"AuthAccount" | undefined>;
                                        acceptedTerms: (Partial<{
                                            __typename?: Partial<"AuthTermsVersion" | undefined>;
                                            name: string;
                                            revision: string;
                                            signature: string;
                                        }> | undefined)[];
                                        birthday?: Partial<{
                                            __typename?: Partial<"AuthDate" | undefined>;
                                            day: number;
                                            month: number;
                                            year: number;
                                        } | null | undefined>;
                                        createdAt: string;
                                        email: string;
                                        emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        externalIds: (Partial<{
                                            __typename?: Partial<"AuthIdentity" | undefined>;
                                            id: string;
                                            type: Partial<import("@chat-gen").AuthIdentityType>;
                                        }> | undefined)[];
                                        flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                                        isBot: Partial<boolean>;
                                        marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                                        matureRatedContentAllowed: Partial<boolean>;
                                        pendingAgreements: (Partial<{
                                            __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                                            name: string;
                                            revision: string;
                                            url: string;
                                        }> | undefined)[];
                                        roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                                        signupOrigin?: Partial<{
                                            __typename?: Partial<"AuthSignupOrigin" | undefined>;
                                            origin?: Partial<any | any | any | null | undefined>;
                                        } | null | undefined>;
                                        state: Partial<ApiEntityState>;
                                        uid: string;
                                    } | null | undefined>;
                                    avatarConfig?: Partial<{
                                        __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                        model: Partial<{
                                            __typename?: Partial<"AvatarAvatar" | undefined>;
                                            avatar3D: string;
                                            avatarComposition: Partial<any>;
                                            avatarLods: (string | undefined)[];
                                            body: string;
                                            face: string;
                                            gender: string;
                                            id: string;
                                            selectable: Partial<boolean>;
                                        }>;
                                        modelId: string;
                                    } | null | undefined>;
                                    avatarUrl: string;
                                    avatars?: Partial<{
                                        __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                        avatar2D: string;
                                        avatar3D: string;
                                        avatarFullbody: string;
                                        avatarGender: string;
                                    } | null | undefined>;
                                    badges: (Partial<{
                                        __typename?: Partial<"BadgeBadge" | undefined>;
                                        level: number;
                                        nextLevelAt: string;
                                        type: Partial<import("@chat-gen").BadgeBadgeType>;
                                    }> | undefined)[];
                                    bio: string;
                                    channel?: Partial<any | null | undefined>;
                                    discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    displayName: string;
                                    friends: (Partial<any> | undefined)[];
                                    friendshipStatus: Partial<{
                                        __typename?: Partial<"FriendsFriendshipStatus" | undefined>;
                                        activity?: Partial<{
                                            __typename?: Partial<"FriendsActivity" | undefined>;
                                            channel?: Partial<any | null | undefined>;
                                            channelId: string;
                                            isOnline: Partial<boolean>;
                                            streamId: string;
                                        } | null | undefined>;
                                        lastStatusChange: string;
                                        status: Partial<import("@chat-gen").FriendsFriendshipStatusStatus>;
                                    }>;
                                    lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                    playedGames: (Partial<{
                                        __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        id: string;
                                        lastPlayedAt: string;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        season: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        seasonId: string;
                                        userId: string;
                                    }> | undefined)[];
                                    settings?: Partial<{
                                        __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                        friends: Partial<{
                                            __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                            disableFriendRequests: Partial<boolean>;
                                        }>;
                                        privacy: Partial<{
                                            __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                            anonymisePurchaseHighlights: Partial<boolean>;
                                            discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                            hideOnlineStatus: Partial<boolean>;
                                            showMatureContentWarning: Partial<boolean>;
                                            visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                        }>;
                                    } | null | undefined>;
                                    state: Partial<ApiEntityState>;
                                    stats: Partial<{
                                        __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                        adsWatched: number;
                                        boosterUsage?: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                            doubt: number;
                                            goodCall: number;
                                            letsGo: number;
                                            nextUp: number;
                                            scavenge: number;
                                            speedUp: number;
                                            total: number;
                                        } | null | undefined>;
                                        cardBundlesPurchased: number;
                                        cardLevelUps: number;
                                        cardsPlayed: number;
                                        cardsSucceeded: number;
                                        currencySpending?: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                            channelCurrency: number;
                                            hardCurrency: number;
                                            softCurrency: number;
                                        } | null | undefined>;
                                        dailyGoalCardsCompleted: number;
                                        dailyGoalCardsSet: number;
                                        matchesPlayed: number;
                                        partyMatchesPlayed: number;
                                        shufflesUsed: number;
                                        soloMatchesPlayed: number;
                                        timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    }>;
                                    userId: string;
                                    userTag: string;
                                    visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                                } | null | undefined>;
                                reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                suspendedAt: string;
                                suspendedBy: string;
                                until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            } | null | undefined>;
                        }>;
                    }>;
                    followerCount: number;
                    following: Partial<boolean>;
                    game: Partial<{
                        __typename?: Partial<"GameGame" | undefined>;
                        activeSeason: Partial<{
                            __typename?: Partial<"GameSeason" | undefined>;
                            badgeUrl: string;
                            cardBackgroundUrls: (Partial<{
                                __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                rarity: Partial<import("@chat-gen").RarityRarity>;
                                url: string;
                            }> | undefined)[];
                            endTime: string;
                            game: Partial<any>;
                            gameId: string;
                            id: string;
                            name: string;
                            progression: Partial<{
                                __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                level: number;
                                nextLevel: number;
                                nextLevelThreshold: number;
                                season: Partial<any>;
                                seasonId: string;
                                xpAmount: number;
                            }>;
                            progressionPauseReason: string;
                            progressionPaused: Partial<boolean>;
                            seasonBreak: Partial<boolean>;
                            seasonBreakReason: string;
                            seasonPauseReason: string;
                            seasonPaused: Partial<boolean>;
                            startTime: string;
                        }>;
                        activeSeasonId: string;
                        backdropUrl: string;
                        iconUrl: string;
                        id: string;
                        name: string;
                        noicePredictionsEnabled: Partial<boolean>;
                        progression: Partial<{
                            __typename?: Partial<"GameUserProgression" | undefined>;
                            experiencePoints: number;
                            level: number;
                            userId: string;
                        }>;
                        publicAccess: Partial<boolean>;
                    }>;
                    gameId: string;
                    id: string;
                    isPublic: Partial<boolean>;
                    itemStats: (Partial<{
                        __typename?: Partial<"ItemItemStat" | undefined>;
                        counts: (Partial<{
                            __typename?: Partial<"ItemItemCount" | undefined>;
                            count: number;
                            type: Partial<import("@chat-gen").ItemItemType>;
                        }> | undefined)[];
                        gameId: string;
                    }> | undefined)[];
                    links: (Partial<{
                        __typename?: Partial<"ChannelChannelLink" | undefined>;
                        name: string;
                        type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                        url: string;
                    }> | undefined)[];
                    liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                    logo: string;
                    logoUrl: string;
                    matureRatedContent: Partial<boolean>;
                    name: string;
                    offlineBanner: string;
                    offlineBannerUrl: string;
                    playedGameIds: (string | undefined)[];
                    state: Partial<ApiEntityState>;
                    streamedGames?: Partial<Partial<{
                        __typename?: Partial<"GameGame" | undefined>;
                        activeSeason: Partial<{
                            __typename?: Partial<"GameSeason" | undefined>;
                            badgeUrl: string;
                            cardBackgroundUrls: (Partial<{
                                __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                rarity: Partial<import("@chat-gen").RarityRarity>;
                                url: string;
                            }> | undefined)[];
                            endTime: string;
                            game: Partial<any>;
                            gameId: string;
                            id: string;
                            name: string;
                            progression: Partial<{
                                __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                level: number;
                                nextLevel: number;
                                nextLevelThreshold: number;
                                season: Partial<any>;
                                seasonId: string;
                                xpAmount: number;
                            }>;
                            progressionPauseReason: string;
                            progressionPaused: Partial<boolean>;
                            seasonBreak: Partial<boolean>;
                            seasonBreakReason: string;
                            seasonPauseReason: string;
                            seasonPaused: Partial<boolean>;
                            startTime: string;
                        }>;
                        activeSeasonId: string;
                        backdropUrl: string;
                        iconUrl: string;
                        id: string;
                        name: string;
                        noicePredictionsEnabled: Partial<boolean>;
                        progression: Partial<{
                            __typename?: Partial<"GameUserProgression" | undefined>;
                            experiencePoints: number;
                            level: number;
                            userId: string;
                        }>;
                        publicAccess: Partial<boolean>;
                    }>[] | null | undefined>;
                    streamer: Partial<any>;
                    streamerId: string;
                    subscriberCount: number;
                    subscription?: Partial<{
                        __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                        activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        channel: Partial<any>;
                        channelId: string;
                        createdAt: string;
                        expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        id: string;
                        paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                        terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        tier: number;
                        userId: string;
                    } | null | undefined>;
                    subscriptionConfig?: Partial<{
                        __typename?: Partial<"SubscriptionChannelSubscriptionConfig" | undefined>;
                        channelId: string;
                        subscriptionsEnabled: Partial<boolean>;
                        tiers: (Partial<{
                            __typename?: Partial<"SubscriptionChannelSubscriptionTier" | undefined>;
                            description: string;
                            entitlements: (Partial<{
                                __typename?: Partial<"SubscriptionChannelSubscriptionEntitlement" | undefined>;
                                amount: number;
                                item: Partial<{
                                    __typename?: Partial<"ItemItem" | undefined>;
                                    attributes: Partial<{
                                        __typename?: Partial<"AttributeAttributeMap" | undefined>;
                                        value: (Partial<{
                                            __typename?: Partial<"AttributeAttributeMapValueEntry" | undefined>;
                                            key: string;
                                            value: Partial<any>;
                                        }> | undefined)[];
                                    }>;
                                    bootstraps?: Partial<Partial<{
                                        __typename?: Partial<"ItemItemBootstrap" | undefined>;
                                        itemCount: number;
                                        itemId: string;
                                        revision: string;
                                    }>[] | null | undefined>;
                                    channelId: string;
                                    children?: Partial<Partial<any>[] | null | undefined>;
                                    consumable: Partial<boolean>;
                                    details?: Partial<{
                                        __typename?: Partial<"AvatarAnimation" | undefined>;
                                        category: (Partial<import("@chat-gen").AvatarAnimationCategory> | undefined)[];
                                        chatCommand: string;
                                        config: Partial<{
                                            __typename?: Partial<"AvatarAnimationConfig" | undefined>;
                                            clamp: Partial<boolean>;
                                            fadeInTimeSec: number;
                                            handedness: Partial<import("@chat-gen").AvatarAnimationHandedness>;
                                            interruptible: Partial<boolean>;
                                            maxLoops: number;
                                            randomizeLoops: Partial<boolean>;
                                        }>;
                                        enabled: Partial<boolean>;
                                        glbUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        mirroredGlbUrl: string;
                                        name: string;
                                    } | {
                                        __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                        baseCard: Partial<{
                                            __typename?: Partial<"GameLogicCard" | undefined>;
                                            activeStreamerCard?: Partial<any | null | undefined>;
                                            activeStreamerCards: (Partial<any> | undefined)[];
                                            availableStreamerCards: (Partial<any> | undefined)[];
                                            backImage: string;
                                            dealingModules: (string | undefined)[];
                                            description: string;
                                            failureModules: (string | undefined)[];
                                            failureTargetValue: number;
                                            familyId: string;
                                            frontImage: string;
                                            gameModes: (string | undefined)[];
                                            icon: string;
                                            id: string;
                                            isAllOrNothing: Partial<boolean>;
                                            isDealtAtStart: Partial<boolean>;
                                            isEnabled: Partial<boolean>;
                                            isMatchCard: Partial<boolean>;
                                            leveling: Partial<any>;
                                            matchCardId: number;
                                            name: string;
                                            pointsMax: number;
                                            pointsMin: number;
                                            pointsTimeTarget: number;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            roleCharacters: (string | undefined)[];
                                            scoredCounterIds: (string | undefined)[];
                                            season: Partial<any>;
                                            seasonId: string;
                                            sides: (string | undefined)[];
                                            successModules: (string | undefined)[];
                                            targetValue: number;
                                            timerDuration: number;
                                            unlockLevel: number;
                                        }>;
                                        channel: Partial<any>;
                                        channelId: string;
                                        draft: Partial<boolean>;
                                        facecam: string;
                                        facecamUrl: string;
                                        familyId: string;
                                        gameId: string;
                                        id: string;
                                        image: string;
                                        imageUrl: string;
                                        name: string;
                                        saleConfig?: Partial<{
                                            __typename?: Partial<"StoreV2StreamerCardSaleConfig" | undefined>;
                                            cardId: string;
                                            channelId: string;
                                            enabled: Partial<boolean>;
                                            excludeFromBundles: Partial<boolean>;
                                            period?: Partial<any | null | undefined>;
                                        } | null | undefined>;
                                        video: string;
                                        videoUrl: string;
                                    } | {
                                        __typename?: Partial<"EmojiEmoji" | undefined>;
                                        channelId: string;
                                        disabled: Partial<boolean>;
                                        id: string;
                                        image: string;
                                        imageUrl: string;
                                        label: string;
                                        name: string;
                                        prefabName: string;
                                    } | {
                                        __typename?: Partial<"GameLogicCard" | undefined>;
                                        activeStreamerCard?: Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        } | null | undefined>;
                                        activeStreamerCards: (Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        }> | undefined)[];
                                        availableStreamerCards: (Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        }> | undefined)[];
                                        backImage: string;
                                        dealingModules: (string | undefined)[];
                                        description: string;
                                        failureModules: (string | undefined)[];
                                        failureTargetValue: number;
                                        familyId: string;
                                        frontImage: string;
                                        gameModes: (string | undefined)[];
                                        icon: string;
                                        id: string;
                                        isAllOrNothing: Partial<boolean>;
                                        isDealtAtStart: Partial<boolean>;
                                        isEnabled: Partial<boolean>;
                                        isMatchCard: Partial<boolean>;
                                        leveling: Partial<{
                                            __typename?: Partial<"GameLogicCardLeveling" | undefined>;
                                            currentLevel: number;
                                            nextLevelLimit: number;
                                            progressToNextLevel: number;
                                        }>;
                                        matchCardId: number;
                                        name: string;
                                        pointsMax: number;
                                        pointsMin: number;
                                        pointsTimeTarget: number;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        roleCharacters: (string | undefined)[];
                                        scoredCounterIds: (string | undefined)[];
                                        season: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        seasonId: string;
                                        sides: (string | undefined)[];
                                        successModules: (string | undefined)[];
                                        targetValue: number;
                                        timerDuration: number;
                                        unlockLevel: number;
                                    } | null | undefined>;
                                    disabled: Partial<boolean>;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    inventoryItem: Partial<{
                                        __typename?: Partial<"InventoryInventoryItem" | undefined>;
                                        item: Partial<any>;
                                        itemCount: number;
                                        itemId: string;
                                    }>;
                                    name: string;
                                    parentItemId: string;
                                    season?: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    } | null | undefined>;
                                    seasonId: string;
                                    type: Partial<import("@chat-gen").ItemItemType>;
                                    unlockItemId: string;
                                }>;
                                itemId: string;
                            }> | undefined)[];
                            level: number;
                            name: string;
                            prices: (Partial<{
                                __typename?: Partial<"SubscriptionSubscriptionPrice" | undefined>;
                                period: Partial<import("@chat-gen").SubscriptionSubscriptionPricePeriod>;
                                price: number;
                            }> | undefined)[];
                        }> | undefined)[];
                    } | null | undefined>;
                    suspension: Partial<{
                        __typename?: Partial<"ChannelSuspension" | undefined>;
                        description: string;
                        moderator?: Partial<{
                            __typename?: Partial<"ProfileProfile" | undefined>;
                            account?: Partial<{
                                __typename?: Partial<"AuthAccount" | undefined>;
                                acceptedTerms: (Partial<{
                                    __typename?: Partial<"AuthTermsVersion" | undefined>;
                                    name: string;
                                    revision: string;
                                    signature: string;
                                }> | undefined)[];
                                birthday?: Partial<{
                                    __typename?: Partial<"AuthDate" | undefined>;
                                    day: number;
                                    month: number;
                                    year: number;
                                } | null | undefined>;
                                createdAt: string;
                                email: string;
                                emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                externalIds: (Partial<{
                                    __typename?: Partial<"AuthIdentity" | undefined>;
                                    id: string;
                                    type: Partial<import("@chat-gen").AuthIdentityType>;
                                }> | undefined)[];
                                flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                                isBot: Partial<boolean>;
                                marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                                matureRatedContentAllowed: Partial<boolean>;
                                pendingAgreements: (Partial<{
                                    __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                                    name: string;
                                    revision: string;
                                    url: string;
                                }> | undefined)[];
                                roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                                signupOrigin?: Partial<{
                                    __typename?: Partial<"AuthSignupOrigin" | undefined>;
                                    origin?: Partial<{
                                        __typename?: Partial<"AuthSignupOriginCampaign" | undefined>;
                                        campaign: string;
                                        content: string;
                                        creator: string;
                                        format: string;
                                        medium: string;
                                        source: string;
                                        term: string;
                                    } | {
                                        __typename?: Partial<"AuthSignupOriginChannel" | undefined>;
                                        channel: Partial<any>;
                                        channelId: string;
                                    } | {
                                        __typename?: Partial<"AuthSignupOriginPage" | undefined>;
                                        url: string;
                                    } | null | undefined>;
                                } | null | undefined>;
                                state: Partial<ApiEntityState>;
                                uid: string;
                            } | null | undefined>;
                            avatarConfig?: Partial<{
                                __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                model: Partial<{
                                    __typename?: Partial<"AvatarAvatar" | undefined>;
                                    avatar3D: string;
                                    avatarComposition: Partial<{
                                        __typename?: Partial<"AvatarAvatarComposition" | undefined>;
                                        generatorVersion: string;
                                        partCustomizations: (Partial<{
                                            __typename?: Partial<"AvatarAvatarPartCustomization" | undefined>;
                                            colors: (string | undefined)[];
                                            lutUrl: string;
                                            partId: string;
                                        }> | undefined)[];
                                        partIds: (string | undefined)[];
                                    }>;
                                    avatarLods: (string | undefined)[];
                                    body: string;
                                    face: string;
                                    gender: string;
                                    id: string;
                                    selectable: Partial<boolean>;
                                }>;
                                modelId: string;
                            } | null | undefined>;
                            avatarUrl: string;
                            avatars?: Partial<{
                                __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                avatar2D: string;
                                avatar3D: string;
                                avatarFullbody: string;
                                avatarGender: string;
                            } | null | undefined>;
                            badges: (Partial<{
                                __typename?: Partial<"BadgeBadge" | undefined>;
                                level: number;
                                nextLevelAt: string;
                                type: Partial<import("@chat-gen").BadgeBadgeType>;
                            }> | undefined)[];
                            bio: string;
                            channel?: Partial<any | null | undefined>;
                            discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            displayName: string;
                            friends: (Partial<any> | undefined)[];
                            friendshipStatus: Partial<{
                                __typename?: Partial<"FriendsFriendshipStatus" | undefined>;
                                activity?: Partial<{
                                    __typename?: Partial<"FriendsActivity" | undefined>;
                                    channel?: Partial<any | null | undefined>;
                                    channelId: string;
                                    isOnline: Partial<boolean>;
                                    streamId: string;
                                } | null | undefined>;
                                lastStatusChange: string;
                                status: Partial<import("@chat-gen").FriendsFriendshipStatusStatus>;
                            }>;
                            lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                            playedGames: (Partial<{
                                __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                game: Partial<{
                                    __typename?: Partial<"GameGame" | undefined>;
                                    activeSeason: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<any>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    }>;
                                    activeSeasonId: string;
                                    backdropUrl: string;
                                    iconUrl: string;
                                    id: string;
                                    name: string;
                                    noicePredictionsEnabled: Partial<boolean>;
                                    progression: Partial<{
                                        __typename?: Partial<"GameUserProgression" | undefined>;
                                        experiencePoints: number;
                                        level: number;
                                        userId: string;
                                    }>;
                                    publicAccess: Partial<boolean>;
                                }>;
                                id: string;
                                lastPlayedAt: string;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                season: Partial<{
                                    __typename?: Partial<"GameSeason" | undefined>;
                                    badgeUrl: string;
                                    cardBackgroundUrls: (Partial<{
                                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        url: string;
                                    }> | undefined)[];
                                    endTime: string;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<any>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    name: string;
                                    progression: Partial<{
                                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                        level: number;
                                        nextLevel: number;
                                        nextLevelThreshold: number;
                                        season: Partial<any>;
                                        seasonId: string;
                                        xpAmount: number;
                                    }>;
                                    progressionPauseReason: string;
                                    progressionPaused: Partial<boolean>;
                                    seasonBreak: Partial<boolean>;
                                    seasonBreakReason: string;
                                    seasonPauseReason: string;
                                    seasonPaused: Partial<boolean>;
                                    startTime: string;
                                }>;
                                seasonId: string;
                                userId: string;
                            }> | undefined)[];
                            settings?: Partial<{
                                __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                friends: Partial<{
                                    __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                    disableFriendRequests: Partial<boolean>;
                                }>;
                                privacy: Partial<{
                                    __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                    anonymisePurchaseHighlights: Partial<boolean>;
                                    discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                    hideOnlineStatus: Partial<boolean>;
                                    showMatureContentWarning: Partial<boolean>;
                                    visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                }>;
                            } | null | undefined>;
                            state: Partial<ApiEntityState>;
                            stats: Partial<{
                                __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                adsWatched: number;
                                boosterUsage?: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                    doubt: number;
                                    goodCall: number;
                                    letsGo: number;
                                    nextUp: number;
                                    scavenge: number;
                                    speedUp: number;
                                    total: number;
                                } | null | undefined>;
                                cardBundlesPurchased: number;
                                cardLevelUps: number;
                                cardsPlayed: number;
                                cardsSucceeded: number;
                                currencySpending?: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                    channelCurrency: number;
                                    hardCurrency: number;
                                    softCurrency: number;
                                } | null | undefined>;
                                dailyGoalCardsCompleted: number;
                                dailyGoalCardsSet: number;
                                matchesPlayed: number;
                                partyMatchesPlayed: number;
                                shufflesUsed: number;
                                soloMatchesPlayed: number;
                                timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            }>;
                            userId: string;
                            userTag: string;
                            visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                        } | null | undefined>;
                        reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                        suspendedAt: string;
                        suspendedBy: string;
                        until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    }>;
                    thumbnail: string;
                    thumbnailUrl: string;
                    title: string;
                    userBanStatus: Partial<any>;
                    viewerCount: number;
                }>;
                channelId: string;
                description: string;
                moderator?: Partial<{
                    __typename?: Partial<"ProfileProfile" | undefined>;
                    account?: Partial<{
                        __typename?: Partial<"AuthAccount" | undefined>;
                        acceptedTerms: (Partial<{
                            __typename?: Partial<"AuthTermsVersion" | undefined>;
                            name: string;
                            revision: string;
                            signature: string;
                        }> | undefined)[];
                        birthday?: Partial<{
                            __typename?: Partial<"AuthDate" | undefined>;
                            day: number;
                            month: number;
                            year: number;
                        } | null | undefined>;
                        createdAt: string;
                        email: string;
                        emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        externalIds: (Partial<{
                            __typename?: Partial<"AuthIdentity" | undefined>;
                            id: string;
                            type: Partial<import("@chat-gen").AuthIdentityType>;
                        }> | undefined)[];
                        flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                        isBot: Partial<boolean>;
                        marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                        matureRatedContentAllowed: Partial<boolean>;
                        pendingAgreements: (Partial<{
                            __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                            name: string;
                            revision: string;
                            url: string;
                        }> | undefined)[];
                        roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                        signupOrigin?: Partial<{
                            __typename?: Partial<"AuthSignupOrigin" | undefined>;
                            origin?: Partial<{
                                __typename?: Partial<"AuthSignupOriginCampaign" | undefined>;
                                campaign: string;
                                content: string;
                                creator: string;
                                format: string;
                                medium: string;
                                source: string;
                                term: string;
                            } | {
                                __typename?: Partial<"AuthSignupOriginChannel" | undefined>;
                                channel: Partial<{
                                    __typename?: Partial<"ChannelChannel" | undefined>;
                                    channelFriends: Partial<{
                                        __typename?: Partial<"FriendsChannelFriends" | undefined>;
                                        channelId: string;
                                        totalCount: number;
                                        users: (Partial<{
                                            __typename?: Partial<"FriendsUser" | undefined>;
                                            activity?: Partial<any | null | undefined>;
                                            lastStatusChange: string;
                                            profile: Partial<any>;
                                            userId: string;
                                        }> | undefined)[];
                                    }>;
                                    currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    currentStreamId: string;
                                    description: string;
                                    features: Partial<{
                                        __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                                        noicePredictions: Partial<{
                                            __typename?: Partial<"ChannelNoicePredictionsFeatureStatus" | undefined>;
                                            enabled: Partial<boolean>;
                                        }>;
                                        streaming: Partial<{
                                            __typename?: Partial<"ChannelStreamingFeatureStatus" | undefined>;
                                            enabled: Partial<boolean>;
                                            suspension?: Partial<any | null | undefined>;
                                        }>;
                                    }>;
                                    followerCount: number;
                                    following: Partial<boolean>;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    isPublic: Partial<boolean>;
                                    itemStats: (Partial<{
                                        __typename?: Partial<"ItemItemStat" | undefined>;
                                        counts: (Partial<{
                                            __typename?: Partial<"ItemItemCount" | undefined>;
                                            count: number;
                                            type: Partial<import("@chat-gen").ItemItemType>;
                                        }> | undefined)[];
                                        gameId: string;
                                    }> | undefined)[];
                                    links: (Partial<{
                                        __typename?: Partial<"ChannelChannelLink" | undefined>;
                                        name: string;
                                        type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                                        url: string;
                                    }> | undefined)[];
                                    liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                    logo: string;
                                    logoUrl: string;
                                    matureRatedContent: Partial<boolean>;
                                    name: string;
                                    offlineBanner: string;
                                    offlineBannerUrl: string;
                                    playedGameIds: (string | undefined)[];
                                    state: Partial<ApiEntityState>;
                                    streamedGames?: Partial<Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>[] | null | undefined>;
                                    streamer: Partial<any>;
                                    streamerId: string;
                                    subscriberCount: number;
                                    subscription?: Partial<{
                                        __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                                        activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        channel: Partial<any>;
                                        channelId: string;
                                        createdAt: string;
                                        expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        id: string;
                                        paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                                        terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        tier: number;
                                        userId: string;
                                    } | null | undefined>;
                                    subscriptionConfig?: Partial<{
                                        __typename?: Partial<"SubscriptionChannelSubscriptionConfig" | undefined>;
                                        channelId: string;
                                        subscriptionsEnabled: Partial<boolean>;
                                        tiers: (Partial<{
                                            __typename?: Partial<"SubscriptionChannelSubscriptionTier" | undefined>;
                                            description: string;
                                            entitlements: (Partial<any> | undefined)[];
                                            level: number;
                                            name: string;
                                            prices: (Partial<any> | undefined)[];
                                        }> | undefined)[];
                                    } | null | undefined>;
                                    suspension: Partial<{
                                        __typename?: Partial<"ChannelSuspension" | undefined>;
                                        description: string;
                                        moderator?: Partial<any | null | undefined>;
                                        reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                        suspendedAt: string;
                                        suspendedBy: string;
                                        until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    }>;
                                    thumbnail: string;
                                    thumbnailUrl: string;
                                    title: string;
                                    userBanStatus: Partial<any>;
                                    viewerCount: number;
                                }>;
                                channelId: string;
                            } | {
                                __typename?: Partial<"AuthSignupOriginPage" | undefined>;
                                url: string;
                            } | null | undefined>;
                        } | null | undefined>;
                        state: Partial<ApiEntityState>;
                        uid: string;
                    } | null | undefined>;
                    avatarConfig?: Partial<{
                        __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                        model: Partial<{
                            __typename?: Partial<"AvatarAvatar" | undefined>;
                            avatar3D: string;
                            avatarComposition: Partial<{
                                __typename?: Partial<"AvatarAvatarComposition" | undefined>;
                                generatorVersion: string;
                                partCustomizations: (Partial<{
                                    __typename?: Partial<"AvatarAvatarPartCustomization" | undefined>;
                                    colors: (string | undefined)[];
                                    lutUrl: string;
                                    partId: string;
                                }> | undefined)[];
                                partIds: (string | undefined)[];
                            }>;
                            avatarLods: (string | undefined)[];
                            body: string;
                            face: string;
                            gender: string;
                            id: string;
                            selectable: Partial<boolean>;
                        }>;
                        modelId: string;
                    } | null | undefined>;
                    avatarUrl: string;
                    avatars?: Partial<{
                        __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                        avatar2D: string;
                        avatar3D: string;
                        avatarFullbody: string;
                        avatarGender: string;
                    } | null | undefined>;
                    badges: (Partial<{
                        __typename?: Partial<"BadgeBadge" | undefined>;
                        level: number;
                        nextLevelAt: string;
                        type: Partial<import("@chat-gen").BadgeBadgeType>;
                    }> | undefined)[];
                    bio: string;
                    channel?: Partial<any | null | undefined>;
                    discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    displayName: string;
                    friends: (Partial<any> | undefined)[];
                    friendshipStatus: Partial<{
                        __typename?: Partial<"FriendsFriendshipStatus" | undefined>;
                        activity?: Partial<{
                            __typename?: Partial<"FriendsActivity" | undefined>;
                            channel?: Partial<any | null | undefined>;
                            channelId: string;
                            isOnline: Partial<boolean>;
                            streamId: string;
                        } | null | undefined>;
                        lastStatusChange: string;
                        status: Partial<import("@chat-gen").FriendsFriendshipStatusStatus>;
                    }>;
                    lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                    playedGames: (Partial<{
                        __typename?: Partial<"ProfilePlayedGame" | undefined>;
                        game: Partial<{
                            __typename?: Partial<"GameGame" | undefined>;
                            activeSeason: Partial<{
                                __typename?: Partial<"GameSeason" | undefined>;
                                badgeUrl: string;
                                cardBackgroundUrls: (Partial<{
                                    __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                    rarity: Partial<import("@chat-gen").RarityRarity>;
                                    url: string;
                                }> | undefined)[];
                                endTime: string;
                                game: Partial<any>;
                                gameId: string;
                                id: string;
                                name: string;
                                progression: Partial<{
                                    __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                    level: number;
                                    nextLevel: number;
                                    nextLevelThreshold: number;
                                    season: Partial<any>;
                                    seasonId: string;
                                    xpAmount: number;
                                }>;
                                progressionPauseReason: string;
                                progressionPaused: Partial<boolean>;
                                seasonBreak: Partial<boolean>;
                                seasonBreakReason: string;
                                seasonPauseReason: string;
                                seasonPaused: Partial<boolean>;
                                startTime: string;
                            }>;
                            activeSeasonId: string;
                            backdropUrl: string;
                            iconUrl: string;
                            id: string;
                            name: string;
                            noicePredictionsEnabled: Partial<boolean>;
                            progression: Partial<{
                                __typename?: Partial<"GameUserProgression" | undefined>;
                                experiencePoints: number;
                                level: number;
                                userId: string;
                            }>;
                            publicAccess: Partial<boolean>;
                        }>;
                        id: string;
                        lastPlayedAt: string;
                        progression: Partial<{
                            __typename?: Partial<"GameUserProgression" | undefined>;
                            experiencePoints: number;
                            level: number;
                            userId: string;
                        }>;
                        season: Partial<{
                            __typename?: Partial<"GameSeason" | undefined>;
                            badgeUrl: string;
                            cardBackgroundUrls: (Partial<{
                                __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                rarity: Partial<import("@chat-gen").RarityRarity>;
                                url: string;
                            }> | undefined)[];
                            endTime: string;
                            game: Partial<{
                                __typename?: Partial<"GameGame" | undefined>;
                                activeSeason: Partial<any>;
                                activeSeasonId: string;
                                backdropUrl: string;
                                iconUrl: string;
                                id: string;
                                name: string;
                                noicePredictionsEnabled: Partial<boolean>;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                publicAccess: Partial<boolean>;
                            }>;
                            gameId: string;
                            id: string;
                            name: string;
                            progression: Partial<{
                                __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                level: number;
                                nextLevel: number;
                                nextLevelThreshold: number;
                                season: Partial<any>;
                                seasonId: string;
                                xpAmount: number;
                            }>;
                            progressionPauseReason: string;
                            progressionPaused: Partial<boolean>;
                            seasonBreak: Partial<boolean>;
                            seasonBreakReason: string;
                            seasonPauseReason: string;
                            seasonPaused: Partial<boolean>;
                            startTime: string;
                        }>;
                        seasonId: string;
                        userId: string;
                    }> | undefined)[];
                    settings?: Partial<{
                        __typename?: Partial<"ProfileProfileSettings" | undefined>;
                        friends: Partial<{
                            __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                            disableFriendRequests: Partial<boolean>;
                        }>;
                        privacy: Partial<{
                            __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                            anonymisePurchaseHighlights: Partial<boolean>;
                            discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                            hideOnlineStatus: Partial<boolean>;
                            showMatureContentWarning: Partial<boolean>;
                            visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                        }>;
                    } | null | undefined>;
                    state: Partial<ApiEntityState>;
                    stats: Partial<{
                        __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                        adsWatched: number;
                        boosterUsage?: Partial<{
                            __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                            doubt: number;
                            goodCall: number;
                            letsGo: number;
                            nextUp: number;
                            scavenge: number;
                            speedUp: number;
                            total: number;
                        } | null | undefined>;
                        cardBundlesPurchased: number;
                        cardLevelUps: number;
                        cardsPlayed: number;
                        cardsSucceeded: number;
                        currencySpending?: Partial<{
                            __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                            channelCurrency: number;
                            hardCurrency: number;
                            softCurrency: number;
                        } | null | undefined>;
                        dailyGoalCardsCompleted: number;
                        dailyGoalCardsSet: number;
                        matchesPlayed: number;
                        partyMatchesPlayed: number;
                        shufflesUsed: number;
                        soloMatchesPlayed: number;
                        timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    }>;
                    userId: string;
                    userTag: string;
                    visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                } | null | undefined>;
                moderatorId: string;
                user: Partial<any>;
                userId: string;
                violation: Partial<import("@chat-gen").ChannelViolation>;
            }>;
            viewerCount: number;
        } | null | undefined>;
        discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
        displayName: string;
        friends: (Partial<any> | undefined)[];
        friendshipStatus: Partial<{
            __typename?: Partial<"FriendsFriendshipStatus" | undefined>;
            activity?: Partial<{
                __typename?: Partial<"FriendsActivity" | undefined>;
                channel?: Partial<{
                    __typename?: Partial<"ChannelChannel" | undefined>;
                    channelFriends: Partial<{
                        __typename?: Partial<"FriendsChannelFriends" | undefined>;
                        channelId: string;
                        totalCount: number;
                        users: (Partial<{
                            __typename?: Partial<"FriendsUser" | undefined>;
                            activity?: Partial<any | null | undefined>;
                            lastStatusChange: string;
                            profile: Partial<any>;
                            userId: string;
                        }> | undefined)[];
                    }>;
                    currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    currentStreamId: string;
                    description: string;
                    features: Partial<{
                        __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                        noicePredictions: Partial<{
                            __typename?: Partial<"ChannelNoicePredictionsFeatureStatus" | undefined>;
                            enabled: Partial<boolean>;
                        }>;
                        streaming: Partial<{
                            __typename?: Partial<"ChannelStreamingFeatureStatus" | undefined>;
                            enabled: Partial<boolean>;
                            suspension?: Partial<{
                                __typename?: Partial<"ChannelSuspension" | undefined>;
                                description: string;
                                moderator?: Partial<{
                                    __typename?: Partial<"ProfileProfile" | undefined>;
                                    account?: Partial<{
                                        __typename?: Partial<"AuthAccount" | undefined>;
                                        acceptedTerms: (Partial<{
                                            __typename?: Partial<"AuthTermsVersion" | undefined>;
                                            name: string;
                                            revision: string;
                                            signature: string;
                                        }> | undefined)[];
                                        birthday?: Partial<{
                                            __typename?: Partial<"AuthDate" | undefined>;
                                            day: number;
                                            month: number;
                                            year: number;
                                        } | null | undefined>;
                                        createdAt: string;
                                        email: string;
                                        emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        externalIds: (Partial<{
                                            __typename?: Partial<"AuthIdentity" | undefined>;
                                            id: string;
                                            type: Partial<import("@chat-gen").AuthIdentityType>;
                                        }> | undefined)[];
                                        flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                                        isBot: Partial<boolean>;
                                        marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                                        matureRatedContentAllowed: Partial<boolean>;
                                        pendingAgreements: (Partial<{
                                            __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                                            name: string;
                                            revision: string;
                                            url: string;
                                        }> | undefined)[];
                                        roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                                        signupOrigin?: Partial<{
                                            __typename?: Partial<"AuthSignupOrigin" | undefined>;
                                            origin?: Partial<any | any | any | null | undefined>;
                                        } | null | undefined>;
                                        state: Partial<ApiEntityState>;
                                        uid: string;
                                    } | null | undefined>;
                                    avatarConfig?: Partial<{
                                        __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                        model: Partial<{
                                            __typename?: Partial<"AvatarAvatar" | undefined>;
                                            avatar3D: string;
                                            avatarComposition: Partial<any>;
                                            avatarLods: (string | undefined)[];
                                            body: string;
                                            face: string;
                                            gender: string;
                                            id: string;
                                            selectable: Partial<boolean>;
                                        }>;
                                        modelId: string;
                                    } | null | undefined>;
                                    avatarUrl: string;
                                    avatars?: Partial<{
                                        __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                        avatar2D: string;
                                        avatar3D: string;
                                        avatarFullbody: string;
                                        avatarGender: string;
                                    } | null | undefined>;
                                    badges: (Partial<{
                                        __typename?: Partial<"BadgeBadge" | undefined>;
                                        level: number;
                                        nextLevelAt: string;
                                        type: Partial<import("@chat-gen").BadgeBadgeType>;
                                    }> | undefined)[];
                                    bio: string;
                                    channel?: Partial<any | null | undefined>;
                                    discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    displayName: string;
                                    friends: (Partial<any> | undefined)[];
                                    friendshipStatus: Partial<any>;
                                    lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                    playedGames: (Partial<{
                                        __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        id: string;
                                        lastPlayedAt: string;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        season: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        seasonId: string;
                                        userId: string;
                                    }> | undefined)[];
                                    settings?: Partial<{
                                        __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                        friends: Partial<{
                                            __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                            disableFriendRequests: Partial<boolean>;
                                        }>;
                                        privacy: Partial<{
                                            __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                            anonymisePurchaseHighlights: Partial<boolean>;
                                            discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                            hideOnlineStatus: Partial<boolean>;
                                            showMatureContentWarning: Partial<boolean>;
                                            visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                        }>;
                                    } | null | undefined>;
                                    state: Partial<ApiEntityState>;
                                    stats: Partial<{
                                        __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                        adsWatched: number;
                                        boosterUsage?: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                            doubt: number;
                                            goodCall: number;
                                            letsGo: number;
                                            nextUp: number;
                                            scavenge: number;
                                            speedUp: number;
                                            total: number;
                                        } | null | undefined>;
                                        cardBundlesPurchased: number;
                                        cardLevelUps: number;
                                        cardsPlayed: number;
                                        cardsSucceeded: number;
                                        currencySpending?: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                            channelCurrency: number;
                                            hardCurrency: number;
                                            softCurrency: number;
                                        } | null | undefined>;
                                        dailyGoalCardsCompleted: number;
                                        dailyGoalCardsSet: number;
                                        matchesPlayed: number;
                                        partyMatchesPlayed: number;
                                        shufflesUsed: number;
                                        soloMatchesPlayed: number;
                                        timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    }>;
                                    userId: string;
                                    userTag: string;
                                    visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                                } | null | undefined>;
                                reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                suspendedAt: string;
                                suspendedBy: string;
                                until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            } | null | undefined>;
                        }>;
                    }>;
                    followerCount: number;
                    following: Partial<boolean>;
                    game: Partial<{
                        __typename?: Partial<"GameGame" | undefined>;
                        activeSeason: Partial<{
                            __typename?: Partial<"GameSeason" | undefined>;
                            badgeUrl: string;
                            cardBackgroundUrls: (Partial<{
                                __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                rarity: Partial<import("@chat-gen").RarityRarity>;
                                url: string;
                            }> | undefined)[];
                            endTime: string;
                            game: Partial<any>;
                            gameId: string;
                            id: string;
                            name: string;
                            progression: Partial<{
                                __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                level: number;
                                nextLevel: number;
                                nextLevelThreshold: number;
                                season: Partial<any>;
                                seasonId: string;
                                xpAmount: number;
                            }>;
                            progressionPauseReason: string;
                            progressionPaused: Partial<boolean>;
                            seasonBreak: Partial<boolean>;
                            seasonBreakReason: string;
                            seasonPauseReason: string;
                            seasonPaused: Partial<boolean>;
                            startTime: string;
                        }>;
                        activeSeasonId: string;
                        backdropUrl: string;
                        iconUrl: string;
                        id: string;
                        name: string;
                        noicePredictionsEnabled: Partial<boolean>;
                        progression: Partial<{
                            __typename?: Partial<"GameUserProgression" | undefined>;
                            experiencePoints: number;
                            level: number;
                            userId: string;
                        }>;
                        publicAccess: Partial<boolean>;
                    }>;
                    gameId: string;
                    id: string;
                    isPublic: Partial<boolean>;
                    itemStats: (Partial<{
                        __typename?: Partial<"ItemItemStat" | undefined>;
                        counts: (Partial<{
                            __typename?: Partial<"ItemItemCount" | undefined>;
                            count: number;
                            type: Partial<import("@chat-gen").ItemItemType>;
                        }> | undefined)[];
                        gameId: string;
                    }> | undefined)[];
                    links: (Partial<{
                        __typename?: Partial<"ChannelChannelLink" | undefined>;
                        name: string;
                        type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                        url: string;
                    }> | undefined)[];
                    liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                    logo: string;
                    logoUrl: string;
                    matureRatedContent: Partial<boolean>;
                    name: string;
                    offlineBanner: string;
                    offlineBannerUrl: string;
                    playedGameIds: (string | undefined)[];
                    state: Partial<ApiEntityState>;
                    streamedGames?: Partial<Partial<{
                        __typename?: Partial<"GameGame" | undefined>;
                        activeSeason: Partial<{
                            __typename?: Partial<"GameSeason" | undefined>;
                            badgeUrl: string;
                            cardBackgroundUrls: (Partial<{
                                __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                rarity: Partial<import("@chat-gen").RarityRarity>;
                                url: string;
                            }> | undefined)[];
                            endTime: string;
                            game: Partial<any>;
                            gameId: string;
                            id: string;
                            name: string;
                            progression: Partial<{
                                __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                level: number;
                                nextLevel: number;
                                nextLevelThreshold: number;
                                season: Partial<any>;
                                seasonId: string;
                                xpAmount: number;
                            }>;
                            progressionPauseReason: string;
                            progressionPaused: Partial<boolean>;
                            seasonBreak: Partial<boolean>;
                            seasonBreakReason: string;
                            seasonPauseReason: string;
                            seasonPaused: Partial<boolean>;
                            startTime: string;
                        }>;
                        activeSeasonId: string;
                        backdropUrl: string;
                        iconUrl: string;
                        id: string;
                        name: string;
                        noicePredictionsEnabled: Partial<boolean>;
                        progression: Partial<{
                            __typename?: Partial<"GameUserProgression" | undefined>;
                            experiencePoints: number;
                            level: number;
                            userId: string;
                        }>;
                        publicAccess: Partial<boolean>;
                    }>[] | null | undefined>;
                    streamer: Partial<any>;
                    streamerId: string;
                    subscriberCount: number;
                    subscription?: Partial<{
                        __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                        activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        channel: Partial<{
                            __typename?: Partial<"ChannelChannel" | undefined>;
                            channelFriends: Partial<{
                                __typename?: Partial<"FriendsChannelFriends" | undefined>;
                                channelId: string;
                                totalCount: number;
                                users: (Partial<{
                                    __typename?: Partial<"FriendsUser" | undefined>;
                                    activity?: Partial<any | null | undefined>;
                                    lastStatusChange: string;
                                    profile: Partial<any>;
                                    userId: string;
                                }> | undefined)[];
                            }>;
                            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            currentStreamId: string;
                            description: string;
                            features: Partial<{
                                __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                                noicePredictions: Partial<{
                                    __typename?: Partial<"ChannelNoicePredictionsFeatureStatus" | undefined>;
                                    enabled: Partial<boolean>;
                                }>;
                                streaming: Partial<{
                                    __typename?: Partial<"ChannelStreamingFeatureStatus" | undefined>;
                                    enabled: Partial<boolean>;
                                    suspension?: Partial<{
                                        __typename?: Partial<"ChannelSuspension" | undefined>;
                                        description: string;
                                        moderator?: Partial<{
                                            __typename?: Partial<"ProfileProfile" | undefined>;
                                            account?: Partial<any | null | undefined>;
                                            avatarConfig?: Partial<any | null | undefined>;
                                            avatarUrl: string;
                                            avatars?: Partial<any | null | undefined>;
                                            badges: (Partial<any> | undefined)[];
                                            bio: string;
                                            channel?: Partial<any | null | undefined>;
                                            discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            displayName: string;
                                            friends: (Partial<any> | undefined)[];
                                            friendshipStatus: Partial<any>;
                                            lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                            playedGames: (Partial<any> | undefined)[];
                                            settings?: Partial<any | null | undefined>;
                                            state: Partial<ApiEntityState>;
                                            stats: Partial<any>;
                                            userId: string;
                                            userTag: string;
                                            visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                                        } | null | undefined>;
                                        reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                        suspendedAt: string;
                                        suspendedBy: string;
                                        until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    } | null | undefined>;
                                }>;
                            }>;
                            followerCount: number;
                            following: Partial<boolean>;
                            game: Partial<{
                                __typename?: Partial<"GameGame" | undefined>;
                                activeSeason: Partial<{
                                    __typename?: Partial<"GameSeason" | undefined>;
                                    badgeUrl: string;
                                    cardBackgroundUrls: (Partial<{
                                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        url: string;
                                    }> | undefined)[];
                                    endTime: string;
                                    game: Partial<any>;
                                    gameId: string;
                                    id: string;
                                    name: string;
                                    progression: Partial<{
                                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                        level: number;
                                        nextLevel: number;
                                        nextLevelThreshold: number;
                                        season: Partial<any>;
                                        seasonId: string;
                                        xpAmount: number;
                                    }>;
                                    progressionPauseReason: string;
                                    progressionPaused: Partial<boolean>;
                                    seasonBreak: Partial<boolean>;
                                    seasonBreakReason: string;
                                    seasonPauseReason: string;
                                    seasonPaused: Partial<boolean>;
                                    startTime: string;
                                }>;
                                activeSeasonId: string;
                                backdropUrl: string;
                                iconUrl: string;
                                id: string;
                                name: string;
                                noicePredictionsEnabled: Partial<boolean>;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                publicAccess: Partial<boolean>;
                            }>;
                            gameId: string;
                            id: string;
                            isPublic: Partial<boolean>;
                            itemStats: (Partial<{
                                __typename?: Partial<"ItemItemStat" | undefined>;
                                counts: (Partial<{
                                    __typename?: Partial<"ItemItemCount" | undefined>;
                                    count: number;
                                    type: Partial<import("@chat-gen").ItemItemType>;
                                }> | undefined)[];
                                gameId: string;
                            }> | undefined)[];
                            links: (Partial<{
                                __typename?: Partial<"ChannelChannelLink" | undefined>;
                                name: string;
                                type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                                url: string;
                            }> | undefined)[];
                            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                            logo: string;
                            logoUrl: string;
                            matureRatedContent: Partial<boolean>;
                            name: string;
                            offlineBanner: string;
                            offlineBannerUrl: string;
                            playedGameIds: (string | undefined)[];
                            state: Partial<ApiEntityState>;
                            streamedGames?: Partial<Partial<{
                                __typename?: Partial<"GameGame" | undefined>;
                                activeSeason: Partial<{
                                    __typename?: Partial<"GameSeason" | undefined>;
                                    badgeUrl: string;
                                    cardBackgroundUrls: (Partial<{
                                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        url: string;
                                    }> | undefined)[];
                                    endTime: string;
                                    game: Partial<any>;
                                    gameId: string;
                                    id: string;
                                    name: string;
                                    progression: Partial<{
                                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                        level: number;
                                        nextLevel: number;
                                        nextLevelThreshold: number;
                                        season: Partial<any>;
                                        seasonId: string;
                                        xpAmount: number;
                                    }>;
                                    progressionPauseReason: string;
                                    progressionPaused: Partial<boolean>;
                                    seasonBreak: Partial<boolean>;
                                    seasonBreakReason: string;
                                    seasonPauseReason: string;
                                    seasonPaused: Partial<boolean>;
                                    startTime: string;
                                }>;
                                activeSeasonId: string;
                                backdropUrl: string;
                                iconUrl: string;
                                id: string;
                                name: string;
                                noicePredictionsEnabled: Partial<boolean>;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                publicAccess: Partial<boolean>;
                            }>[] | null | undefined>;
                            streamer: Partial<any>;
                            streamerId: string;
                            subscriberCount: number;
                            subscription?: Partial<any | null | undefined>;
                            subscriptionConfig?: Partial<{
                                __typename?: Partial<"SubscriptionChannelSubscriptionConfig" | undefined>;
                                channelId: string;
                                subscriptionsEnabled: Partial<boolean>;
                                tiers: (Partial<{
                                    __typename?: Partial<"SubscriptionChannelSubscriptionTier" | undefined>;
                                    description: string;
                                    entitlements: (Partial<{
                                        __typename?: Partial<"SubscriptionChannelSubscriptionEntitlement" | undefined>;
                                        amount: number;
                                        item: Partial<{
                                            __typename?: Partial<"ItemItem" | undefined>;
                                            attributes: Partial<any>;
                                            bootstraps?: Partial<Partial<any>[] | null | undefined>;
                                            channelId: string;
                                            children?: Partial<Partial<any>[] | null | undefined>;
                                            consumable: Partial<boolean>;
                                            details?: Partial<any | any | any | any | null | undefined>;
                                            disabled: Partial<boolean>;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            inventoryItem: Partial<any>;
                                            name: string;
                                            parentItemId: string;
                                            season?: Partial<any | null | undefined>;
                                            seasonId: string;
                                            type: Partial<import("@chat-gen").ItemItemType>;
                                            unlockItemId: string;
                                        }>;
                                        itemId: string;
                                    }> | undefined)[];
                                    level: number;
                                    name: string;
                                    prices: (Partial<{
                                        __typename?: Partial<"SubscriptionSubscriptionPrice" | undefined>;
                                        period: Partial<import("@chat-gen").SubscriptionSubscriptionPricePeriod>;
                                        price: number;
                                    }> | undefined)[];
                                }> | undefined)[];
                            } | null | undefined>;
                            suspension: Partial<{
                                __typename?: Partial<"ChannelSuspension" | undefined>;
                                description: string;
                                moderator?: Partial<{
                                    __typename?: Partial<"ProfileProfile" | undefined>;
                                    account?: Partial<{
                                        __typename?: Partial<"AuthAccount" | undefined>;
                                        acceptedTerms: (Partial<{
                                            __typename?: Partial<"AuthTermsVersion" | undefined>;
                                            name: string;
                                            revision: string;
                                            signature: string;
                                        }> | undefined)[];
                                        birthday?: Partial<{
                                            __typename?: Partial<"AuthDate" | undefined>;
                                            day: number;
                                            month: number;
                                            year: number;
                                        } | null | undefined>;
                                        createdAt: string;
                                        email: string;
                                        emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        externalIds: (Partial<{
                                            __typename?: Partial<"AuthIdentity" | undefined>;
                                            id: string;
                                            type: Partial<import("@chat-gen").AuthIdentityType>;
                                        }> | undefined)[];
                                        flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                                        isBot: Partial<boolean>;
                                        marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                                        matureRatedContentAllowed: Partial<boolean>;
                                        pendingAgreements: (Partial<{
                                            __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                                            name: string;
                                            revision: string;
                                            url: string;
                                        }> | undefined)[];
                                        roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                                        signupOrigin?: Partial<{
                                            __typename?: Partial<"AuthSignupOrigin" | undefined>;
                                            origin?: Partial<any | any | any | null | undefined>;
                                        } | null | undefined>;
                                        state: Partial<ApiEntityState>;
                                        uid: string;
                                    } | null | undefined>;
                                    avatarConfig?: Partial<{
                                        __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                        model: Partial<{
                                            __typename?: Partial<"AvatarAvatar" | undefined>;
                                            avatar3D: string;
                                            avatarComposition: Partial<any>;
                                            avatarLods: (string | undefined)[];
                                            body: string;
                                            face: string;
                                            gender: string;
                                            id: string;
                                            selectable: Partial<boolean>;
                                        }>;
                                        modelId: string;
                                    } | null | undefined>;
                                    avatarUrl: string;
                                    avatars?: Partial<{
                                        __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                        avatar2D: string;
                                        avatar3D: string;
                                        avatarFullbody: string;
                                        avatarGender: string;
                                    } | null | undefined>;
                                    badges: (Partial<{
                                        __typename?: Partial<"BadgeBadge" | undefined>;
                                        level: number;
                                        nextLevelAt: string;
                                        type: Partial<import("@chat-gen").BadgeBadgeType>;
                                    }> | undefined)[];
                                    bio: string;
                                    channel?: Partial<any | null | undefined>;
                                    discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    displayName: string;
                                    friends: (Partial<any> | undefined)[];
                                    friendshipStatus: Partial<any>;
                                    lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                    playedGames: (Partial<{
                                        __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        id: string;
                                        lastPlayedAt: string;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        season: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        seasonId: string;
                                        userId: string;
                                    }> | undefined)[];
                                    settings?: Partial<{
                                        __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                        friends: Partial<{
                                            __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                            disableFriendRequests: Partial<boolean>;
                                        }>;
                                        privacy: Partial<{
                                            __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                            anonymisePurchaseHighlights: Partial<boolean>;
                                            discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                            hideOnlineStatus: Partial<boolean>;
                                            showMatureContentWarning: Partial<boolean>;
                                            visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                        }>;
                                    } | null | undefined>;
                                    state: Partial<ApiEntityState>;
                                    stats: Partial<{
                                        __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                        adsWatched: number;
                                        boosterUsage?: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                            doubt: number;
                                            goodCall: number;
                                            letsGo: number;
                                            nextUp: number;
                                            scavenge: number;
                                            speedUp: number;
                                            total: number;
                                        } | null | undefined>;
                                        cardBundlesPurchased: number;
                                        cardLevelUps: number;
                                        cardsPlayed: number;
                                        cardsSucceeded: number;
                                        currencySpending?: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                            channelCurrency: number;
                                            hardCurrency: number;
                                            softCurrency: number;
                                        } | null | undefined>;
                                        dailyGoalCardsCompleted: number;
                                        dailyGoalCardsSet: number;
                                        matchesPlayed: number;
                                        partyMatchesPlayed: number;
                                        shufflesUsed: number;
                                        soloMatchesPlayed: number;
                                        timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    }>;
                                    userId: string;
                                    userTag: string;
                                    visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                                } | null | undefined>;
                                reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                suspendedAt: string;
                                suspendedBy: string;
                                until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            }>;
                            thumbnail: string;
                            thumbnailUrl: string;
                            title: string;
                            userBanStatus: Partial<{
                                __typename?: Partial<"ChannelUserBanStatus" | undefined>;
                                appeal?: Partial<{
                                    __typename?: Partial<"ChannelBanAppealInfo" | undefined>;
                                    appealText: string;
                                    createdAt: string;
                                    reviewer: Partial<any>;
                                    reviewerComment: string;
                                    reviewerId: string;
                                    status: Partial<import("@chat-gen").ChannelAppealStatus>;
                                } | null | undefined>;
                                banned: Partial<boolean>;
                                bannedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                channel: Partial<any>;
                                channelId: string;
                                description: string;
                                moderator?: Partial<{
                                    __typename?: Partial<"ProfileProfile" | undefined>;
                                    account?: Partial<{
                                        __typename?: Partial<"AuthAccount" | undefined>;
                                        acceptedTerms: (Partial<{
                                            __typename?: Partial<"AuthTermsVersion" | undefined>;
                                            name: string;
                                            revision: string;
                                            signature: string;
                                        }> | undefined)[];
                                        birthday?: Partial<{
                                            __typename?: Partial<"AuthDate" | undefined>;
                                            day: number;
                                            month: number;
                                            year: number;
                                        } | null | undefined>;
                                        createdAt: string;
                                        email: string;
                                        emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        externalIds: (Partial<{
                                            __typename?: Partial<"AuthIdentity" | undefined>;
                                            id: string;
                                            type: Partial<import("@chat-gen").AuthIdentityType>;
                                        }> | undefined)[];
                                        flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                                        isBot: Partial<boolean>;
                                        marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                                        matureRatedContentAllowed: Partial<boolean>;
                                        pendingAgreements: (Partial<{
                                            __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                                            name: string;
                                            revision: string;
                                            url: string;
                                        }> | undefined)[];
                                        roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                                        signupOrigin?: Partial<{
                                            __typename?: Partial<"AuthSignupOrigin" | undefined>;
                                            origin?: Partial<any | any | any | null | undefined>;
                                        } | null | undefined>;
                                        state: Partial<ApiEntityState>;
                                        uid: string;
                                    } | null | undefined>;
                                    avatarConfig?: Partial<{
                                        __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                        model: Partial<{
                                            __typename?: Partial<"AvatarAvatar" | undefined>;
                                            avatar3D: string;
                                            avatarComposition: Partial<any>;
                                            avatarLods: (string | undefined)[];
                                            body: string;
                                            face: string;
                                            gender: string;
                                            id: string;
                                            selectable: Partial<boolean>;
                                        }>;
                                        modelId: string;
                                    } | null | undefined>;
                                    avatarUrl: string;
                                    avatars?: Partial<{
                                        __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                        avatar2D: string;
                                        avatar3D: string;
                                        avatarFullbody: string;
                                        avatarGender: string;
                                    } | null | undefined>;
                                    badges: (Partial<{
                                        __typename?: Partial<"BadgeBadge" | undefined>;
                                        level: number;
                                        nextLevelAt: string;
                                        type: Partial<import("@chat-gen").BadgeBadgeType>;
                                    }> | undefined)[];
                                    bio: string;
                                    channel?: Partial<any | null | undefined>;
                                    discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    displayName: string;
                                    friends: (Partial<any> | undefined)[];
                                    friendshipStatus: Partial<any>;
                                    lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                    playedGames: (Partial<{
                                        __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        id: string;
                                        lastPlayedAt: string;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        season: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        seasonId: string;
                                        userId: string;
                                    }> | undefined)[];
                                    settings?: Partial<{
                                        __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                        friends: Partial<{
                                            __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                            disableFriendRequests: Partial<boolean>;
                                        }>;
                                        privacy: Partial<{
                                            __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                            anonymisePurchaseHighlights: Partial<boolean>;
                                            discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                            hideOnlineStatus: Partial<boolean>;
                                            showMatureContentWarning: Partial<boolean>;
                                            visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                        }>;
                                    } | null | undefined>;
                                    state: Partial<ApiEntityState>;
                                    stats: Partial<{
                                        __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                        adsWatched: number;
                                        boosterUsage?: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                            doubt: number;
                                            goodCall: number;
                                            letsGo: number;
                                            nextUp: number;
                                            scavenge: number;
                                            speedUp: number;
                                            total: number;
                                        } | null | undefined>;
                                        cardBundlesPurchased: number;
                                        cardLevelUps: number;
                                        cardsPlayed: number;
                                        cardsSucceeded: number;
                                        currencySpending?: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                            channelCurrency: number;
                                            hardCurrency: number;
                                            softCurrency: number;
                                        } | null | undefined>;
                                        dailyGoalCardsCompleted: number;
                                        dailyGoalCardsSet: number;
                                        matchesPlayed: number;
                                        partyMatchesPlayed: number;
                                        shufflesUsed: number;
                                        soloMatchesPlayed: number;
                                        timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    }>;
                                    userId: string;
                                    userTag: string;
                                    visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                                } | null | undefined>;
                                moderatorId: string;
                                user: Partial<any>;
                                userId: string;
                                violation: Partial<import("@chat-gen").ChannelViolation>;
                            }>;
                            viewerCount: number;
                        }>;
                        channelId: string;
                        createdAt: string;
                        expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        id: string;
                        paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                        terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        tier: number;
                        userId: string;
                    } | null | undefined>;
                    subscriptionConfig?: Partial<{
                        __typename?: Partial<"SubscriptionChannelSubscriptionConfig" | undefined>;
                        channelId: string;
                        subscriptionsEnabled: Partial<boolean>;
                        tiers: (Partial<{
                            __typename?: Partial<"SubscriptionChannelSubscriptionTier" | undefined>;
                            description: string;
                            entitlements: (Partial<{
                                __typename?: Partial<"SubscriptionChannelSubscriptionEntitlement" | undefined>;
                                amount: number;
                                item: Partial<{
                                    __typename?: Partial<"ItemItem" | undefined>;
                                    attributes: Partial<{
                                        __typename?: Partial<"AttributeAttributeMap" | undefined>;
                                        value: (Partial<{
                                            __typename?: Partial<"AttributeAttributeMapValueEntry" | undefined>;
                                            key: string;
                                            value: Partial<any>;
                                        }> | undefined)[];
                                    }>;
                                    bootstraps?: Partial<Partial<{
                                        __typename?: Partial<"ItemItemBootstrap" | undefined>;
                                        itemCount: number;
                                        itemId: string;
                                        revision: string;
                                    }>[] | null | undefined>;
                                    channelId: string;
                                    children?: Partial<Partial<any>[] | null | undefined>;
                                    consumable: Partial<boolean>;
                                    details?: Partial<{
                                        __typename?: Partial<"AvatarAnimation" | undefined>;
                                        category: (Partial<import("@chat-gen").AvatarAnimationCategory> | undefined)[];
                                        chatCommand: string;
                                        config: Partial<{
                                            __typename?: Partial<"AvatarAnimationConfig" | undefined>;
                                            clamp: Partial<boolean>;
                                            fadeInTimeSec: number;
                                            handedness: Partial<import("@chat-gen").AvatarAnimationHandedness>;
                                            interruptible: Partial<boolean>;
                                            maxLoops: number;
                                            randomizeLoops: Partial<boolean>;
                                        }>;
                                        enabled: Partial<boolean>;
                                        glbUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        mirroredGlbUrl: string;
                                        name: string;
                                    } | {
                                        __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                        baseCard: Partial<{
                                            __typename?: Partial<"GameLogicCard" | undefined>;
                                            activeStreamerCard?: Partial<any | null | undefined>;
                                            activeStreamerCards: (Partial<any> | undefined)[];
                                            availableStreamerCards: (Partial<any> | undefined)[];
                                            backImage: string;
                                            dealingModules: (string | undefined)[];
                                            description: string;
                                            failureModules: (string | undefined)[];
                                            failureTargetValue: number;
                                            familyId: string;
                                            frontImage: string;
                                            gameModes: (string | undefined)[];
                                            icon: string;
                                            id: string;
                                            isAllOrNothing: Partial<boolean>;
                                            isDealtAtStart: Partial<boolean>;
                                            isEnabled: Partial<boolean>;
                                            isMatchCard: Partial<boolean>;
                                            leveling: Partial<any>;
                                            matchCardId: number;
                                            name: string;
                                            pointsMax: number;
                                            pointsMin: number;
                                            pointsTimeTarget: number;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            roleCharacters: (string | undefined)[];
                                            scoredCounterIds: (string | undefined)[];
                                            season: Partial<any>;
                                            seasonId: string;
                                            sides: (string | undefined)[];
                                            successModules: (string | undefined)[];
                                            targetValue: number;
                                            timerDuration: number;
                                            unlockLevel: number;
                                        }>;
                                        channel: Partial<{
                                            __typename?: Partial<"ChannelChannel" | undefined>;
                                            channelFriends: Partial<any>;
                                            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            currentStreamId: string;
                                            description: string;
                                            features: Partial<any>;
                                            followerCount: number;
                                            following: Partial<boolean>;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            isPublic: Partial<boolean>;
                                            itemStats: (Partial<any> | undefined)[];
                                            links: (Partial<any> | undefined)[];
                                            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                            logo: string;
                                            logoUrl: string;
                                            matureRatedContent: Partial<boolean>;
                                            name: string;
                                            offlineBanner: string;
                                            offlineBannerUrl: string;
                                            playedGameIds: (string | undefined)[];
                                            state: Partial<ApiEntityState>;
                                            streamedGames?: Partial<Partial<any>[] | null | undefined>;
                                            streamer: Partial<any>;
                                            streamerId: string;
                                            subscriberCount: number;
                                            subscription?: Partial<any | null | undefined>;
                                            subscriptionConfig?: Partial<any | null | undefined>;
                                            suspension: Partial<any>;
                                            thumbnail: string;
                                            thumbnailUrl: string;
                                            title: string;
                                            userBanStatus: Partial<any>;
                                            viewerCount: number;
                                        }>;
                                        channelId: string;
                                        draft: Partial<boolean>;
                                        facecam: string;
                                        facecamUrl: string;
                                        familyId: string;
                                        gameId: string;
                                        id: string;
                                        image: string;
                                        imageUrl: string;
                                        name: string;
                                        saleConfig?: Partial<{
                                            __typename?: Partial<"StoreV2StreamerCardSaleConfig" | undefined>;
                                            cardId: string;
                                            channelId: string;
                                            enabled: Partial<boolean>;
                                            excludeFromBundles: Partial<boolean>;
                                            period?: Partial<any | null | undefined>;
                                        } | null | undefined>;
                                        video: string;
                                        videoUrl: string;
                                    } | {
                                        __typename?: Partial<"EmojiEmoji" | undefined>;
                                        channelId: string;
                                        disabled: Partial<boolean>;
                                        id: string;
                                        image: string;
                                        imageUrl: string;
                                        label: string;
                                        name: string;
                                        prefabName: string;
                                    } | {
                                        __typename?: Partial<"GameLogicCard" | undefined>;
                                        activeStreamerCard?: Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        } | null | undefined>;
                                        activeStreamerCards: (Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        }> | undefined)[];
                                        availableStreamerCards: (Partial<{
                                            __typename?: Partial<"GameLogicStreamerCard" | undefined>;
                                            baseCard: Partial<any>;
                                            channel: Partial<any>;
                                            channelId: string;
                                            draft: Partial<boolean>;
                                            facecam: string;
                                            facecamUrl: string;
                                            familyId: string;
                                            gameId: string;
                                            id: string;
                                            image: string;
                                            imageUrl: string;
                                            name: string;
                                            saleConfig?: Partial<any | null | undefined>;
                                            video: string;
                                            videoUrl: string;
                                        }> | undefined)[];
                                        backImage: string;
                                        dealingModules: (string | undefined)[];
                                        description: string;
                                        failureModules: (string | undefined)[];
                                        failureTargetValue: number;
                                        familyId: string;
                                        frontImage: string;
                                        gameModes: (string | undefined)[];
                                        icon: string;
                                        id: string;
                                        isAllOrNothing: Partial<boolean>;
                                        isDealtAtStart: Partial<boolean>;
                                        isEnabled: Partial<boolean>;
                                        isMatchCard: Partial<boolean>;
                                        leveling: Partial<{
                                            __typename?: Partial<"GameLogicCardLeveling" | undefined>;
                                            currentLevel: number;
                                            nextLevelLimit: number;
                                            progressToNextLevel: number;
                                        }>;
                                        matchCardId: number;
                                        name: string;
                                        pointsMax: number;
                                        pointsMin: number;
                                        pointsTimeTarget: number;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        roleCharacters: (string | undefined)[];
                                        scoredCounterIds: (string | undefined)[];
                                        season: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        seasonId: string;
                                        sides: (string | undefined)[];
                                        successModules: (string | undefined)[];
                                        targetValue: number;
                                        timerDuration: number;
                                        unlockLevel: number;
                                    } | null | undefined>;
                                    disabled: Partial<boolean>;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    inventoryItem: Partial<{
                                        __typename?: Partial<"InventoryInventoryItem" | undefined>;
                                        item: Partial<any>;
                                        itemCount: number;
                                        itemId: string;
                                    }>;
                                    name: string;
                                    parentItemId: string;
                                    season?: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    } | null | undefined>;
                                    seasonId: string;
                                    type: Partial<import("@chat-gen").ItemItemType>;
                                    unlockItemId: string;
                                }>;
                                itemId: string;
                            }> | undefined)[];
                            level: number;
                            name: string;
                            prices: (Partial<{
                                __typename?: Partial<"SubscriptionSubscriptionPrice" | undefined>;
                                period: Partial<import("@chat-gen").SubscriptionSubscriptionPricePeriod>;
                                price: number;
                            }> | undefined)[];
                        }> | undefined)[];
                    } | null | undefined>;
                    suspension: Partial<{
                        __typename?: Partial<"ChannelSuspension" | undefined>;
                        description: string;
                        moderator?: Partial<{
                            __typename?: Partial<"ProfileProfile" | undefined>;
                            account?: Partial<{
                                __typename?: Partial<"AuthAccount" | undefined>;
                                acceptedTerms: (Partial<{
                                    __typename?: Partial<"AuthTermsVersion" | undefined>;
                                    name: string;
                                    revision: string;
                                    signature: string;
                                }> | undefined)[];
                                birthday?: Partial<{
                                    __typename?: Partial<"AuthDate" | undefined>;
                                    day: number;
                                    month: number;
                                    year: number;
                                } | null | undefined>;
                                createdAt: string;
                                email: string;
                                emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                externalIds: (Partial<{
                                    __typename?: Partial<"AuthIdentity" | undefined>;
                                    id: string;
                                    type: Partial<import("@chat-gen").AuthIdentityType>;
                                }> | undefined)[];
                                flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                                isBot: Partial<boolean>;
                                marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                                matureRatedContentAllowed: Partial<boolean>;
                                pendingAgreements: (Partial<{
                                    __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                                    name: string;
                                    revision: string;
                                    url: string;
                                }> | undefined)[];
                                roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                                signupOrigin?: Partial<{
                                    __typename?: Partial<"AuthSignupOrigin" | undefined>;
                                    origin?: Partial<{
                                        __typename?: Partial<"AuthSignupOriginCampaign" | undefined>;
                                        campaign: string;
                                        content: string;
                                        creator: string;
                                        format: string;
                                        medium: string;
                                        source: string;
                                        term: string;
                                    } | {
                                        __typename?: Partial<"AuthSignupOriginChannel" | undefined>;
                                        channel: Partial<{
                                            __typename?: Partial<"ChannelChannel" | undefined>;
                                            channelFriends: Partial<any>;
                                            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            currentStreamId: string;
                                            description: string;
                                            features: Partial<any>;
                                            followerCount: number;
                                            following: Partial<boolean>;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            isPublic: Partial<boolean>;
                                            itemStats: (Partial<any> | undefined)[];
                                            links: (Partial<any> | undefined)[];
                                            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                            logo: string;
                                            logoUrl: string;
                                            matureRatedContent: Partial<boolean>;
                                            name: string;
                                            offlineBanner: string;
                                            offlineBannerUrl: string;
                                            playedGameIds: (string | undefined)[];
                                            state: Partial<ApiEntityState>;
                                            streamedGames?: Partial<Partial<any>[] | null | undefined>;
                                            streamer: Partial<any>;
                                            streamerId: string;
                                            subscriberCount: number;
                                            subscription?: Partial<any | null | undefined>;
                                            subscriptionConfig?: Partial<any | null | undefined>;
                                            suspension: Partial<any>;
                                            thumbnail: string;
                                            thumbnailUrl: string;
                                            title: string;
                                            userBanStatus: Partial<any>;
                                            viewerCount: number;
                                        }>;
                                        channelId: string;
                                    } | {
                                        __typename?: Partial<"AuthSignupOriginPage" | undefined>;
                                        url: string;
                                    } | null | undefined>;
                                } | null | undefined>;
                                state: Partial<ApiEntityState>;
                                uid: string;
                            } | null | undefined>;
                            avatarConfig?: Partial<{
                                __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                model: Partial<{
                                    __typename?: Partial<"AvatarAvatar" | undefined>;
                                    avatar3D: string;
                                    avatarComposition: Partial<{
                                        __typename?: Partial<"AvatarAvatarComposition" | undefined>;
                                        generatorVersion: string;
                                        partCustomizations: (Partial<{
                                            __typename?: Partial<"AvatarAvatarPartCustomization" | undefined>;
                                            colors: (string | undefined)[];
                                            lutUrl: string;
                                            partId: string;
                                        }> | undefined)[];
                                        partIds: (string | undefined)[];
                                    }>;
                                    avatarLods: (string | undefined)[];
                                    body: string;
                                    face: string;
                                    gender: string;
                                    id: string;
                                    selectable: Partial<boolean>;
                                }>;
                                modelId: string;
                            } | null | undefined>;
                            avatarUrl: string;
                            avatars?: Partial<{
                                __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                avatar2D: string;
                                avatar3D: string;
                                avatarFullbody: string;
                                avatarGender: string;
                            } | null | undefined>;
                            badges: (Partial<{
                                __typename?: Partial<"BadgeBadge" | undefined>;
                                level: number;
                                nextLevelAt: string;
                                type: Partial<import("@chat-gen").BadgeBadgeType>;
                            }> | undefined)[];
                            bio: string;
                            channel?: Partial<any | null | undefined>;
                            discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            displayName: string;
                            friends: (Partial<any> | undefined)[];
                            friendshipStatus: Partial<any>;
                            lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                            playedGames: (Partial<{
                                __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                game: Partial<{
                                    __typename?: Partial<"GameGame" | undefined>;
                                    activeSeason: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<any>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    }>;
                                    activeSeasonId: string;
                                    backdropUrl: string;
                                    iconUrl: string;
                                    id: string;
                                    name: string;
                                    noicePredictionsEnabled: Partial<boolean>;
                                    progression: Partial<{
                                        __typename?: Partial<"GameUserProgression" | undefined>;
                                        experiencePoints: number;
                                        level: number;
                                        userId: string;
                                    }>;
                                    publicAccess: Partial<boolean>;
                                }>;
                                id: string;
                                lastPlayedAt: string;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                season: Partial<{
                                    __typename?: Partial<"GameSeason" | undefined>;
                                    badgeUrl: string;
                                    cardBackgroundUrls: (Partial<{
                                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        url: string;
                                    }> | undefined)[];
                                    endTime: string;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<any>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    name: string;
                                    progression: Partial<{
                                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                        level: number;
                                        nextLevel: number;
                                        nextLevelThreshold: number;
                                        season: Partial<any>;
                                        seasonId: string;
                                        xpAmount: number;
                                    }>;
                                    progressionPauseReason: string;
                                    progressionPaused: Partial<boolean>;
                                    seasonBreak: Partial<boolean>;
                                    seasonBreakReason: string;
                                    seasonPauseReason: string;
                                    seasonPaused: Partial<boolean>;
                                    startTime: string;
                                }>;
                                seasonId: string;
                                userId: string;
                            }> | undefined)[];
                            settings?: Partial<{
                                __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                friends: Partial<{
                                    __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                    disableFriendRequests: Partial<boolean>;
                                }>;
                                privacy: Partial<{
                                    __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                    anonymisePurchaseHighlights: Partial<boolean>;
                                    discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                    hideOnlineStatus: Partial<boolean>;
                                    showMatureContentWarning: Partial<boolean>;
                                    visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                }>;
                            } | null | undefined>;
                            state: Partial<ApiEntityState>;
                            stats: Partial<{
                                __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                adsWatched: number;
                                boosterUsage?: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                    doubt: number;
                                    goodCall: number;
                                    letsGo: number;
                                    nextUp: number;
                                    scavenge: number;
                                    speedUp: number;
                                    total: number;
                                } | null | undefined>;
                                cardBundlesPurchased: number;
                                cardLevelUps: number;
                                cardsPlayed: number;
                                cardsSucceeded: number;
                                currencySpending?: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                    channelCurrency: number;
                                    hardCurrency: number;
                                    softCurrency: number;
                                } | null | undefined>;
                                dailyGoalCardsCompleted: number;
                                dailyGoalCardsSet: number;
                                matchesPlayed: number;
                                partyMatchesPlayed: number;
                                shufflesUsed: number;
                                soloMatchesPlayed: number;
                                timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            }>;
                            userId: string;
                            userTag: string;
                            visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                        } | null | undefined>;
                        reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                        suspendedAt: string;
                        suspendedBy: string;
                        until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                    }>;
                    thumbnail: string;
                    thumbnailUrl: string;
                    title: string;
                    userBanStatus: Partial<{
                        __typename?: Partial<"ChannelUserBanStatus" | undefined>;
                        appeal?: Partial<{
                            __typename?: Partial<"ChannelBanAppealInfo" | undefined>;
                            appealText: string;
                            createdAt: string;
                            reviewer: Partial<any>;
                            reviewerComment: string;
                            reviewerId: string;
                            status: Partial<import("@chat-gen").ChannelAppealStatus>;
                        } | null | undefined>;
                        banned: Partial<boolean>;
                        bannedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                        channel: Partial<{
                            __typename?: Partial<"ChannelChannel" | undefined>;
                            channelFriends: Partial<{
                                __typename?: Partial<"FriendsChannelFriends" | undefined>;
                                channelId: string;
                                totalCount: number;
                                users: (Partial<{
                                    __typename?: Partial<"FriendsUser" | undefined>;
                                    activity?: Partial<any | null | undefined>;
                                    lastStatusChange: string;
                                    profile: Partial<any>;
                                    userId: string;
                                }> | undefined)[];
                            }>;
                            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            currentStreamId: string;
                            description: string;
                            features: Partial<{
                                __typename?: Partial<"ChannelChannelFeatures" | undefined>;
                                noicePredictions: Partial<{
                                    __typename?: Partial<"ChannelNoicePredictionsFeatureStatus" | undefined>;
                                    enabled: Partial<boolean>;
                                }>;
                                streaming: Partial<{
                                    __typename?: Partial<"ChannelStreamingFeatureStatus" | undefined>;
                                    enabled: Partial<boolean>;
                                    suspension?: Partial<{
                                        __typename?: Partial<"ChannelSuspension" | undefined>;
                                        description: string;
                                        moderator?: Partial<{
                                            __typename?: Partial<"ProfileProfile" | undefined>;
                                            account?: Partial<any | null | undefined>;
                                            avatarConfig?: Partial<any | null | undefined>;
                                            avatarUrl: string;
                                            avatars?: Partial<any | null | undefined>;
                                            badges: (Partial<any> | undefined)[];
                                            bio: string;
                                            channel?: Partial<any | null | undefined>;
                                            discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            displayName: string;
                                            friends: (Partial<any> | undefined)[];
                                            friendshipStatus: Partial<any>;
                                            lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                            playedGames: (Partial<any> | undefined)[];
                                            settings?: Partial<any | null | undefined>;
                                            state: Partial<ApiEntityState>;
                                            stats: Partial<any>;
                                            userId: string;
                                            userTag: string;
                                            visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                                        } | null | undefined>;
                                        reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                        suspendedAt: string;
                                        suspendedBy: string;
                                        until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    } | null | undefined>;
                                }>;
                            }>;
                            followerCount: number;
                            following: Partial<boolean>;
                            game: Partial<{
                                __typename?: Partial<"GameGame" | undefined>;
                                activeSeason: Partial<{
                                    __typename?: Partial<"GameSeason" | undefined>;
                                    badgeUrl: string;
                                    cardBackgroundUrls: (Partial<{
                                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        url: string;
                                    }> | undefined)[];
                                    endTime: string;
                                    game: Partial<any>;
                                    gameId: string;
                                    id: string;
                                    name: string;
                                    progression: Partial<{
                                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                        level: number;
                                        nextLevel: number;
                                        nextLevelThreshold: number;
                                        season: Partial<any>;
                                        seasonId: string;
                                        xpAmount: number;
                                    }>;
                                    progressionPauseReason: string;
                                    progressionPaused: Partial<boolean>;
                                    seasonBreak: Partial<boolean>;
                                    seasonBreakReason: string;
                                    seasonPauseReason: string;
                                    seasonPaused: Partial<boolean>;
                                    startTime: string;
                                }>;
                                activeSeasonId: string;
                                backdropUrl: string;
                                iconUrl: string;
                                id: string;
                                name: string;
                                noicePredictionsEnabled: Partial<boolean>;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                publicAccess: Partial<boolean>;
                            }>;
                            gameId: string;
                            id: string;
                            isPublic: Partial<boolean>;
                            itemStats: (Partial<{
                                __typename?: Partial<"ItemItemStat" | undefined>;
                                counts: (Partial<{
                                    __typename?: Partial<"ItemItemCount" | undefined>;
                                    count: number;
                                    type: Partial<import("@chat-gen").ItemItemType>;
                                }> | undefined)[];
                                gameId: string;
                            }> | undefined)[];
                            links: (Partial<{
                                __typename?: Partial<"ChannelChannelLink" | undefined>;
                                name: string;
                                type: Partial<import("@chat-gen").ChannelChannelLinkLinkType>;
                                url: string;
                            }> | undefined)[];
                            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                            logo: string;
                            logoUrl: string;
                            matureRatedContent: Partial<boolean>;
                            name: string;
                            offlineBanner: string;
                            offlineBannerUrl: string;
                            playedGameIds: (string | undefined)[];
                            state: Partial<ApiEntityState>;
                            streamedGames?: Partial<Partial<{
                                __typename?: Partial<"GameGame" | undefined>;
                                activeSeason: Partial<{
                                    __typename?: Partial<"GameSeason" | undefined>;
                                    badgeUrl: string;
                                    cardBackgroundUrls: (Partial<{
                                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        url: string;
                                    }> | undefined)[];
                                    endTime: string;
                                    game: Partial<any>;
                                    gameId: string;
                                    id: string;
                                    name: string;
                                    progression: Partial<{
                                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                        level: number;
                                        nextLevel: number;
                                        nextLevelThreshold: number;
                                        season: Partial<any>;
                                        seasonId: string;
                                        xpAmount: number;
                                    }>;
                                    progressionPauseReason: string;
                                    progressionPaused: Partial<boolean>;
                                    seasonBreak: Partial<boolean>;
                                    seasonBreakReason: string;
                                    seasonPauseReason: string;
                                    seasonPaused: Partial<boolean>;
                                    startTime: string;
                                }>;
                                activeSeasonId: string;
                                backdropUrl: string;
                                iconUrl: string;
                                id: string;
                                name: string;
                                noicePredictionsEnabled: Partial<boolean>;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                publicAccess: Partial<boolean>;
                            }>[] | null | undefined>;
                            streamer: Partial<any>;
                            streamerId: string;
                            subscriberCount: number;
                            subscription?: Partial<{
                                __typename?: Partial<"SubscriptionChannelSubscription" | undefined>;
                                activatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                cancelledAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                channel: Partial<any>;
                                channelId: string;
                                createdAt: string;
                                expiresAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                id: string;
                                paymentFailedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                renewedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                state: Partial<import("@chat-gen").SubscriptionChannelSubscriptionState>;
                                terminatedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                tier: number;
                                userId: string;
                            } | null | undefined>;
                            subscriptionConfig?: Partial<{
                                __typename?: Partial<"SubscriptionChannelSubscriptionConfig" | undefined>;
                                channelId: string;
                                subscriptionsEnabled: Partial<boolean>;
                                tiers: (Partial<{
                                    __typename?: Partial<"SubscriptionChannelSubscriptionTier" | undefined>;
                                    description: string;
                                    entitlements: (Partial<{
                                        __typename?: Partial<"SubscriptionChannelSubscriptionEntitlement" | undefined>;
                                        amount: number;
                                        item: Partial<{
                                            __typename?: Partial<"ItemItem" | undefined>;
                                            attributes: Partial<any>;
                                            bootstraps?: Partial<Partial<any>[] | null | undefined>;
                                            channelId: string;
                                            children?: Partial<Partial<any>[] | null | undefined>;
                                            consumable: Partial<boolean>;
                                            details?: Partial<any | any | any | any | null | undefined>;
                                            disabled: Partial<boolean>;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            inventoryItem: Partial<any>;
                                            name: string;
                                            parentItemId: string;
                                            season?: Partial<any | null | undefined>;
                                            seasonId: string;
                                            type: Partial<import("@chat-gen").ItemItemType>;
                                            unlockItemId: string;
                                        }>;
                                        itemId: string;
                                    }> | undefined)[];
                                    level: number;
                                    name: string;
                                    prices: (Partial<{
                                        __typename?: Partial<"SubscriptionSubscriptionPrice" | undefined>;
                                        period: Partial<import("@chat-gen").SubscriptionSubscriptionPricePeriod>;
                                        price: number;
                                    }> | undefined)[];
                                }> | undefined)[];
                            } | null | undefined>;
                            suspension: Partial<{
                                __typename?: Partial<"ChannelSuspension" | undefined>;
                                description: string;
                                moderator?: Partial<{
                                    __typename?: Partial<"ProfileProfile" | undefined>;
                                    account?: Partial<{
                                        __typename?: Partial<"AuthAccount" | undefined>;
                                        acceptedTerms: (Partial<{
                                            __typename?: Partial<"AuthTermsVersion" | undefined>;
                                            name: string;
                                            revision: string;
                                            signature: string;
                                        }> | undefined)[];
                                        birthday?: Partial<{
                                            __typename?: Partial<"AuthDate" | undefined>;
                                            day: number;
                                            month: number;
                                            year: number;
                                        } | null | undefined>;
                                        createdAt: string;
                                        email: string;
                                        emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                        externalIds: (Partial<{
                                            __typename?: Partial<"AuthIdentity" | undefined>;
                                            id: string;
                                            type: Partial<import("@chat-gen").AuthIdentityType>;
                                        }> | undefined)[];
                                        flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                                        isBot: Partial<boolean>;
                                        marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                                        matureRatedContentAllowed: Partial<boolean>;
                                        pendingAgreements: (Partial<{
                                            __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                                            name: string;
                                            revision: string;
                                            url: string;
                                        }> | undefined)[];
                                        roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                                        signupOrigin?: Partial<{
                                            __typename?: Partial<"AuthSignupOrigin" | undefined>;
                                            origin?: Partial<any | any | any | null | undefined>;
                                        } | null | undefined>;
                                        state: Partial<ApiEntityState>;
                                        uid: string;
                                    } | null | undefined>;
                                    avatarConfig?: Partial<{
                                        __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                        model: Partial<{
                                            __typename?: Partial<"AvatarAvatar" | undefined>;
                                            avatar3D: string;
                                            avatarComposition: Partial<any>;
                                            avatarLods: (string | undefined)[];
                                            body: string;
                                            face: string;
                                            gender: string;
                                            id: string;
                                            selectable: Partial<boolean>;
                                        }>;
                                        modelId: string;
                                    } | null | undefined>;
                                    avatarUrl: string;
                                    avatars?: Partial<{
                                        __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                        avatar2D: string;
                                        avatar3D: string;
                                        avatarFullbody: string;
                                        avatarGender: string;
                                    } | null | undefined>;
                                    badges: (Partial<{
                                        __typename?: Partial<"BadgeBadge" | undefined>;
                                        level: number;
                                        nextLevelAt: string;
                                        type: Partial<import("@chat-gen").BadgeBadgeType>;
                                    }> | undefined)[];
                                    bio: string;
                                    channel?: Partial<any | null | undefined>;
                                    discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    displayName: string;
                                    friends: (Partial<any> | undefined)[];
                                    friendshipStatus: Partial<any>;
                                    lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                                    playedGames: (Partial<{
                                        __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                        game: Partial<{
                                            __typename?: Partial<"GameGame" | undefined>;
                                            activeSeason: Partial<any>;
                                            activeSeasonId: string;
                                            backdropUrl: string;
                                            iconUrl: string;
                                            id: string;
                                            name: string;
                                            noicePredictionsEnabled: Partial<boolean>;
                                            progression: Partial<any>;
                                            publicAccess: Partial<boolean>;
                                        }>;
                                        id: string;
                                        lastPlayedAt: string;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        season: Partial<{
                                            __typename?: Partial<"GameSeason" | undefined>;
                                            badgeUrl: string;
                                            cardBackgroundUrls: (Partial<any> | undefined)[];
                                            endTime: string;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            name: string;
                                            progression: Partial<any>;
                                            progressionPauseReason: string;
                                            progressionPaused: Partial<boolean>;
                                            seasonBreak: Partial<boolean>;
                                            seasonBreakReason: string;
                                            seasonPauseReason: string;
                                            seasonPaused: Partial<boolean>;
                                            startTime: string;
                                        }>;
                                        seasonId: string;
                                        userId: string;
                                    }> | undefined)[];
                                    settings?: Partial<{
                                        __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                        friends: Partial<{
                                            __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                            disableFriendRequests: Partial<boolean>;
                                        }>;
                                        privacy: Partial<{
                                            __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                            anonymisePurchaseHighlights: Partial<boolean>;
                                            discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                            hideOnlineStatus: Partial<boolean>;
                                            showMatureContentWarning: Partial<boolean>;
                                            visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                        }>;
                                    } | null | undefined>;
                                    state: Partial<ApiEntityState>;
                                    stats: Partial<{
                                        __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                        adsWatched: number;
                                        boosterUsage?: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                            doubt: number;
                                            goodCall: number;
                                            letsGo: number;
                                            nextUp: number;
                                            scavenge: number;
                                            speedUp: number;
                                            total: number;
                                        } | null | undefined>;
                                        cardBundlesPurchased: number;
                                        cardLevelUps: number;
                                        cardsPlayed: number;
                                        cardsSucceeded: number;
                                        currencySpending?: Partial<{
                                            __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                            channelCurrency: number;
                                            hardCurrency: number;
                                            softCurrency: number;
                                        } | null | undefined>;
                                        dailyGoalCardsCompleted: number;
                                        dailyGoalCardsSet: number;
                                        matchesPlayed: number;
                                        partyMatchesPlayed: number;
                                        shufflesUsed: number;
                                        soloMatchesPlayed: number;
                                        timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                    }>;
                                    userId: string;
                                    userTag: string;
                                    visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                                } | null | undefined>;
                                reason: Partial<import("@chat-gen").ChannelSuspensionReason>;
                                suspendedAt: string;
                                suspendedBy: string;
                                until?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            }>;
                            thumbnail: string;
                            thumbnailUrl: string;
                            title: string;
                            userBanStatus: Partial<any>;
                            viewerCount: number;
                        }>;
                        channelId: string;
                        description: string;
                        moderator?: Partial<{
                            __typename?: Partial<"ProfileProfile" | undefined>;
                            account?: Partial<{
                                __typename?: Partial<"AuthAccount" | undefined>;
                                acceptedTerms: (Partial<{
                                    __typename?: Partial<"AuthTermsVersion" | undefined>;
                                    name: string;
                                    revision: string;
                                    signature: string;
                                }> | undefined)[];
                                birthday?: Partial<{
                                    __typename?: Partial<"AuthDate" | undefined>;
                                    day: number;
                                    month: number;
                                    year: number;
                                } | null | undefined>;
                                createdAt: string;
                                email: string;
                                emailVerifiedAt?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                externalIds: (Partial<{
                                    __typename?: Partial<"AuthIdentity" | undefined>;
                                    id: string;
                                    type: Partial<import("@chat-gen").AuthIdentityType>;
                                }> | undefined)[];
                                flags: (Partial<import("@chat-gen").AuthAccountStatusFlag> | undefined)[];
                                isBot: Partial<boolean>;
                                marketingConsent: Partial<import("@chat-gen").AuthConsentStatus>;
                                matureRatedContentAllowed: Partial<boolean>;
                                pendingAgreements: (Partial<{
                                    __typename?: Partial<"AgreementAgreementRevision" | undefined>;
                                    name: string;
                                    revision: string;
                                    url: string;
                                }> | undefined)[];
                                roles: (Partial<import("@chat-gen").AuthPlatformRole> | undefined)[];
                                signupOrigin?: Partial<{
                                    __typename?: Partial<"AuthSignupOrigin" | undefined>;
                                    origin?: Partial<{
                                        __typename?: Partial<"AuthSignupOriginCampaign" | undefined>;
                                        campaign: string;
                                        content: string;
                                        creator: string;
                                        format: string;
                                        medium: string;
                                        source: string;
                                        term: string;
                                    } | {
                                        __typename?: Partial<"AuthSignupOriginChannel" | undefined>;
                                        channel: Partial<{
                                            __typename?: Partial<"ChannelChannel" | undefined>;
                                            channelFriends: Partial<any>;
                                            currentChatId?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                                            currentStreamId: string;
                                            description: string;
                                            features: Partial<any>;
                                            followerCount: number;
                                            following: Partial<boolean>;
                                            game: Partial<any>;
                                            gameId: string;
                                            id: string;
                                            isPublic: Partial<boolean>;
                                            itemStats: (Partial<any> | undefined)[];
                                            links: (Partial<any> | undefined)[];
                                            liveStatus: Partial<import("@chat-gen").ChannelLiveStatus>;
                                            logo: string;
                                            logoUrl: string;
                                            matureRatedContent: Partial<boolean>;
                                            name: string;
                                            offlineBanner: string;
                                            offlineBannerUrl: string;
                                            playedGameIds: (string | undefined)[];
                                            state: Partial<ApiEntityState>;
                                            streamedGames?: Partial<Partial<any>[] | null | undefined>;
                                            streamer: Partial<any>;
                                            streamerId: string;
                                            subscriberCount: number;
                                            subscription?: Partial<any | null | undefined>;
                                            subscriptionConfig?: Partial<any | null | undefined>;
                                            suspension: Partial<any>;
                                            thumbnail: string;
                                            thumbnailUrl: string;
                                            title: string;
                                            userBanStatus: Partial<any>;
                                            viewerCount: number;
                                        }>;
                                        channelId: string;
                                    } | {
                                        __typename?: Partial<"AuthSignupOriginPage" | undefined>;
                                        url: string;
                                    } | null | undefined>;
                                } | null | undefined>;
                                state: Partial<ApiEntityState>;
                                uid: string;
                            } | null | undefined>;
                            avatarConfig?: Partial<{
                                __typename?: Partial<"ProfileProfileAvatarConfig" | undefined>;
                                model: Partial<{
                                    __typename?: Partial<"AvatarAvatar" | undefined>;
                                    avatar3D: string;
                                    avatarComposition: Partial<{
                                        __typename?: Partial<"AvatarAvatarComposition" | undefined>;
                                        generatorVersion: string;
                                        partCustomizations: (Partial<{
                                            __typename?: Partial<"AvatarAvatarPartCustomization" | undefined>;
                                            colors: (string | undefined)[];
                                            lutUrl: string;
                                            partId: string;
                                        }> | undefined)[];
                                        partIds: (string | undefined)[];
                                    }>;
                                    avatarLods: (string | undefined)[];
                                    body: string;
                                    face: string;
                                    gender: string;
                                    id: string;
                                    selectable: Partial<boolean>;
                                }>;
                                modelId: string;
                            } | null | undefined>;
                            avatarUrl: string;
                            avatars?: Partial<{
                                __typename?: Partial<"ProfileProfileAvatars" | undefined>;
                                avatar2D: string;
                                avatar3D: string;
                                avatarFullbody: string;
                                avatarGender: string;
                            } | null | undefined>;
                            badges: (Partial<{
                                __typename?: Partial<"BadgeBadge" | undefined>;
                                level: number;
                                nextLevelAt: string;
                                type: Partial<import("@chat-gen").BadgeBadgeType>;
                            }> | undefined)[];
                            bio: string;
                            channel?: Partial<any | null | undefined>;
                            discordUsername?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            displayName: string;
                            friends: (Partial<any> | undefined)[];
                            friendshipStatus: Partial<any>;
                            lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
                            playedGames: (Partial<{
                                __typename?: Partial<"ProfilePlayedGame" | undefined>;
                                game: Partial<{
                                    __typename?: Partial<"GameGame" | undefined>;
                                    activeSeason: Partial<{
                                        __typename?: Partial<"GameSeason" | undefined>;
                                        badgeUrl: string;
                                        cardBackgroundUrls: (Partial<{
                                            __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                            rarity: Partial<import("@chat-gen").RarityRarity>;
                                            url: string;
                                        }> | undefined)[];
                                        endTime: string;
                                        game: Partial<any>;
                                        gameId: string;
                                        id: string;
                                        name: string;
                                        progression: Partial<{
                                            __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                            level: number;
                                            nextLevel: number;
                                            nextLevelThreshold: number;
                                            season: Partial<any>;
                                            seasonId: string;
                                            xpAmount: number;
                                        }>;
                                        progressionPauseReason: string;
                                        progressionPaused: Partial<boolean>;
                                        seasonBreak: Partial<boolean>;
                                        seasonBreakReason: string;
                                        seasonPauseReason: string;
                                        seasonPaused: Partial<boolean>;
                                        startTime: string;
                                    }>;
                                    activeSeasonId: string;
                                    backdropUrl: string;
                                    iconUrl: string;
                                    id: string;
                                    name: string;
                                    noicePredictionsEnabled: Partial<boolean>;
                                    progression: Partial<{
                                        __typename?: Partial<"GameUserProgression" | undefined>;
                                        experiencePoints: number;
                                        level: number;
                                        userId: string;
                                    }>;
                                    publicAccess: Partial<boolean>;
                                }>;
                                id: string;
                                lastPlayedAt: string;
                                progression: Partial<{
                                    __typename?: Partial<"GameUserProgression" | undefined>;
                                    experiencePoints: number;
                                    level: number;
                                    userId: string;
                                }>;
                                season: Partial<{
                                    __typename?: Partial<"GameSeason" | undefined>;
                                    badgeUrl: string;
                                    cardBackgroundUrls: (Partial<{
                                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                                        rarity: Partial<import("@chat-gen").RarityRarity>;
                                        url: string;
                                    }> | undefined)[];
                                    endTime: string;
                                    game: Partial<{
                                        __typename?: Partial<"GameGame" | undefined>;
                                        activeSeason: Partial<any>;
                                        activeSeasonId: string;
                                        backdropUrl: string;
                                        iconUrl: string;
                                        id: string;
                                        name: string;
                                        noicePredictionsEnabled: Partial<boolean>;
                                        progression: Partial<{
                                            __typename?: Partial<"GameUserProgression" | undefined>;
                                            experiencePoints: number;
                                            level: number;
                                            userId: string;
                                        }>;
                                        publicAccess: Partial<boolean>;
                                    }>;
                                    gameId: string;
                                    id: string;
                                    name: string;
                                    progression: Partial<{
                                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                                        level: number;
                                        nextLevel: number;
                                        nextLevelThreshold: number;
                                        season: Partial<any>;
                                        seasonId: string;
                                        xpAmount: number;
                                    }>;
                                    progressionPauseReason: string;
                                    progressionPaused: Partial<boolean>;
                                    seasonBreak: Partial<boolean>;
                                    seasonBreakReason: string;
                                    seasonPauseReason: string;
                                    seasonPaused: Partial<boolean>;
                                    startTime: string;
                                }>;
                                seasonId: string;
                                userId: string;
                            }> | undefined)[];
                            settings?: Partial<{
                                __typename?: Partial<"ProfileProfileSettings" | undefined>;
                                friends: Partial<{
                                    __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                                    disableFriendRequests: Partial<boolean>;
                                }>;
                                privacy: Partial<{
                                    __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                                    anonymisePurchaseHighlights: Partial<boolean>;
                                    discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                    hideOnlineStatus: Partial<boolean>;
                                    showMatureContentWarning: Partial<boolean>;
                                    visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                                }>;
                            } | null | undefined>;
                            state: Partial<ApiEntityState>;
                            stats: Partial<{
                                __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
                                adsWatched: number;
                                boosterUsage?: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                                    doubt: number;
                                    goodCall: number;
                                    letsGo: number;
                                    nextUp: number;
                                    scavenge: number;
                                    speedUp: number;
                                    total: number;
                                } | null | undefined>;
                                cardBundlesPurchased: number;
                                cardLevelUps: number;
                                cardsPlayed: number;
                                cardsSucceeded: number;
                                currencySpending?: Partial<{
                                    __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                                    channelCurrency: number;
                                    hardCurrency: number;
                                    softCurrency: number;
                                } | null | undefined>;
                                dailyGoalCardsCompleted: number;
                                dailyGoalCardsSet: number;
                                matchesPlayed: number;
                                partyMatchesPlayed: number;
                                shufflesUsed: number;
                                soloMatchesPlayed: number;
                                timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
                            }>;
                            userId: string;
                            userTag: string;
                            visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
                        } | null | undefined>;
                        moderatorId: string;
                        user: Partial<any>;
                        userId: string;
                        violation: Partial<import("@chat-gen").ChannelViolation>;
                    }>;
                    viewerCount: number;
                } | null | undefined>;
                channelId: string;
                isOnline: Partial<boolean>;
                streamId: string;
            } | null | undefined>;
            lastStatusChange: string;
            status: Partial<import("@chat-gen").FriendsFriendshipStatusStatus>;
        }>;
        lastSeen?: Partial<import("@chat-gen").Maybe<string> | undefined>;
        onlineStatus: Partial<import("@chat-gen").ProfilePresenceStatus>;
        playedGames: (Partial<{
            __typename?: Partial<"ProfilePlayedGame" | undefined>;
            game: Partial<{
                __typename?: Partial<"GameGame" | undefined>;
                activeSeason: Partial<{
                    __typename?: Partial<"GameSeason" | undefined>;
                    badgeUrl: string;
                    cardBackgroundUrls: (Partial<{
                        __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                        rarity: Partial<import("@chat-gen").RarityRarity>;
                        url: string;
                    }> | undefined)[];
                    endTime: string;
                    game: Partial<any>;
                    gameId: string;
                    id: string;
                    name: string;
                    progression: Partial<{
                        __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                        level: number;
                        nextLevel: number;
                        nextLevelThreshold: number;
                        season: Partial<any>;
                        seasonId: string;
                        xpAmount: number;
                    }>;
                    progressionPauseReason: string;
                    progressionPaused: Partial<boolean>;
                    seasonBreak: Partial<boolean>;
                    seasonBreakReason: string;
                    seasonPauseReason: string;
                    seasonPaused: Partial<boolean>;
                    startTime: string;
                }>;
                activeSeasonId: string;
                backdropUrl: string;
                iconUrl: string;
                id: string;
                name: string;
                noicePredictionsEnabled: Partial<boolean>;
                progression: Partial<{
                    __typename?: Partial<"GameUserProgression" | undefined>;
                    experiencePoints: number;
                    level: number;
                    userId: string;
                }>;
                publicAccess: Partial<boolean>;
            }>;
            id: string;
            lastPlayedAt: string;
            progression: Partial<{
                __typename?: Partial<"GameUserProgression" | undefined>;
                experiencePoints: number;
                level: number;
                userId: string;
            }>;
            season: Partial<{
                __typename?: Partial<"GameSeason" | undefined>;
                badgeUrl: string;
                cardBackgroundUrls: (Partial<{
                    __typename?: Partial<"GameSeasonCardBackgroundAsset" | undefined>;
                    rarity: Partial<import("@chat-gen").RarityRarity>;
                    url: string;
                }> | undefined)[];
                endTime: string;
                game: Partial<{
                    __typename?: Partial<"GameGame" | undefined>;
                    activeSeason: Partial<any>;
                    activeSeasonId: string;
                    backdropUrl: string;
                    iconUrl: string;
                    id: string;
                    name: string;
                    noicePredictionsEnabled: Partial<boolean>;
                    progression: Partial<{
                        __typename?: Partial<"GameUserProgression" | undefined>;
                        experiencePoints: number;
                        level: number;
                        userId: string;
                    }>;
                    publicAccess: Partial<boolean>;
                }>;
                gameId: string;
                id: string;
                name: string;
                progression: Partial<{
                    __typename?: Partial<"ProgressionSeasonProgression" | undefined>;
                    level: number;
                    nextLevel: number;
                    nextLevelThreshold: number;
                    season: Partial<any>;
                    seasonId: string;
                    xpAmount: number;
                }>;
                progressionPauseReason: string;
                progressionPaused: Partial<boolean>;
                seasonBreak: Partial<boolean>;
                seasonBreakReason: string;
                seasonPauseReason: string;
                seasonPaused: Partial<boolean>;
                startTime: string;
            }>;
            seasonId: string;
            userId: string;
        }> | undefined)[];
        settings?: Partial<{
            __typename?: Partial<"ProfileProfileSettings" | undefined>;
            friends: Partial<{
                __typename?: Partial<"FriendsFriendsSettings" | undefined>;
                disableFriendRequests: Partial<boolean>;
            }>;
            privacy: Partial<{
                __typename?: Partial<"ProfilePrivacySettings" | undefined>;
                anonymisePurchaseHighlights: Partial<boolean>;
                discordUsernameVisibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
                hideOnlineStatus: Partial<boolean>;
                showMatureContentWarning: Partial<boolean>;
                visibility: Partial<import("@chat-gen").ProfilePrivacySettingsVisibility>;
            }>;
        } | null | undefined>;
        state: Partial<ApiEntityState>;
        stats: Partial<{
            __typename?: Partial<"PlayerStatsPlayerStats" | undefined>;
            adsWatched: number;
            boosterUsage?: Partial<{
                __typename?: Partial<"PlayerStatsPlayerStatsBoosterUsage" | undefined>;
                doubt: number;
                goodCall: number;
                letsGo: number;
                nextUp: number;
                scavenge: number;
                speedUp: number;
                total: number;
            } | null | undefined>;
            cardBundlesPurchased: number;
            cardLevelUps: number;
            cardsPlayed: number;
            cardsSucceeded: number;
            currencySpending?: Partial<{
                __typename?: Partial<"PlayerStatsPlayerStatsCurrencySpending" | undefined>;
                channelCurrency: number;
                hardCurrency: number;
                softCurrency: number;
            } | null | undefined>;
            dailyGoalCardsCompleted: number;
            dailyGoalCardsSet: number;
            matchesPlayed: number;
            partyMatchesPlayed: number;
            shufflesUsed: number;
            soloMatchesPlayed: number;
            timePlayed?: Partial<import("@chat-gen").Maybe<string> | undefined>;
        }>;
        userId: string;
        userTag: string;
        visibility: Partial<import("@chat-gen").ProfileProfileVisibility>;
    }>;
    senderId: string;
    state: Partial<ApiEntityState>;
    textClassification: Partial<{
        __typename?: Partial<"ClassificationTextClassification" | undefined>;
        escalations: (string | undefined)[];
        events: (Partial<{
            __typename?: Partial<"ClassificationEvent" | undefined>;
            event?: Partial<{
                __typename?: Partial<"ClassificationEventCustomEvent" | undefined>;
                id: string;
                message: string;
            } | {
                __typename?: Partial<"ClassificationEventEventFlooding" | undefined>;
                count: number;
                id: string;
                limit: number;
            } | {
                __typename?: Partial<"ClassificationEventEventTrustChanged" | undefined>;
                id: string;
                message: string;
                oldTrustLevel: Partial<import("@chat-gen").ClassificationTrustLevel>;
                trustLevel: Partial<import("@chat-gen").ClassificationTrustLevel>;
            } | null | undefined>;
        }> | undefined)[];
        hashed: string;
        hashes: (number | undefined)[];
        highRiskLanguage: string;
        notableIndexes: (number | undefined)[];
        response: Partial<boolean>;
        risk: Partial<import("@chat-gen").ClassificationTextRisk>;
        topics: (Partial<{
            __typename?: Partial<"ClassificationTextClassificationTopicTextRiskLevel" | undefined>;
            risk: Partial<import("@chat-gen").ClassificationTextRisk>;
            topic: Partial<import("@chat-gen").ClassificationTopic>;
        }> | undefined)[];
        trust: Partial<import("@chat-gen").ClassificationTrustLevel>;
    }>;
    username: string;
}>>(chatMessage: T) => boolean;
