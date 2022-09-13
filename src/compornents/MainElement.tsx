import PrefElement from './PrefElement'
import React, { useEffect } from 'react';
import { User } from '../models/user';
import UserListElement from './UserListElement';
import "./MainElement.css";
import { useParams, useNavigate } from 'react-router-dom';
import PageNationElement from './PageNationElement';

export default function MainElement() {
    const params = useParams();
    const navigate = useNavigate();
    const [pref, setPref] = React.useState<string | null>(null);
    const [count, setCount] = React.useState(0)
    const [page, setPage] = React.useState(1)
    const [users, setUsers] = React.useState<User[]>([])
    useEffect(() => {
        if (params.pref && params.page) {
            setPref(params.pref)
            setPage(parseInt(params.page))
        } else {
            setPref("Tokyo")
            setPage(1)
        }
    }, [params.pref, params.page])

    useEffect(() => {
        const f = async () => {
            if (!pref) {
                return;
            }
            const res = await fetch(`https://githubuser-5dyx7gwrfq-de.a.run.app/?pref=${pref}&page=${page}`);
            const json = await res.json();
            setCount(json.data.total_count)
            setUsers(json.data.items)
        };
        f();
    }, [pref, page])

    return (
        <div className='pl-5  pr-2'>
            <div className='sticky z-50 w-full bg-gray-800/80 backdrop-blur-sm'>
                <h1 className='text-3xl lg:text-5xl md:text-l font-black text-center pt-5 text-white'>地元のGitHubユーザー</h1>
                <PrefElement
                    prefChange={(pref: string) => {
                        navigate(`/${pref}/${1}`)
                    }}
                    count={count}
                    pref={pref ?? ""}
                ></PrefElement >
            </div >
            <UserListElement
                users={users}
                page={page}
            ></UserListElement>
            <PageNationElement
                pageChange={(page: number) => {
                    navigate(`/${pref}/${page}`)
                }}
                page={page}
            ></PageNationElement>
        </div >
    )
}